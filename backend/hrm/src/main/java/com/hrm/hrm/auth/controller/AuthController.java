package com.hrm.hrm.auth.controller;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.hrm.hrm.auth.service.GmailService;
import com.hrm.hrm.common.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import com.hrm.hrm.auth.dto.SendCodeRequest;
import com.hrm.hrm.auth.dto.VerifyCodeRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    private final GmailService gmailService;

    private final Map<String, Credential> credentialStore = new HashMap<>();

    // 인증코드 저장 (email -> code, 만료시간)
    private final Map<String, CodeWithExpiry> codeStore = new HashMap<>();
    // 인증된 이메일 저장
    public static final Set<String> verifiedEmails = new HashSet<>();

    // 인증코드+만료시간 저장용 내부 클래스
    private static class CodeWithExpiry {
        String code;
        long expiry;
        CodeWithExpiry(String code, long expiry) {
            this.code = code;
            this.expiry = expiry;
        }
    }

    @Autowired
    public AuthController(GmailService gmailService) {
        this.gmailService = gmailService;
    }

    @GetMapping("/google")
    public void redirectToGoogleAuth(HttpServletResponse response) throws IOException {
        String oauthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + clientId +
                "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8) +
                "&response_type=code" +
                "&scope=" + URLEncoder.encode("https://www.googleapis.com/auth/gmail.send", StandardCharsets.UTF_8) +
                "&access_type=offline" +
                "&prompt=consent";
        response.sendRedirect(oauthUrl);
    }

    @Operation(summary = "구글 인증 콜백", description = "구글 OAuth 인증 후 콜백을 처리합니다. code 파라미터를 받아 인증을 완료합니다.")
    @GetMapping("/google/callback")
    public ApiResponse<String> handleGoogleCallback(@RequestParam("code") String code) {
        try {
            GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance(),
                    clientId,
                    clientSecret,
                    code,
                    redirectUri
            ).execute();

            Credential credential = new GoogleCredential.Builder()
                    .setTransport(GoogleNetHttpTransport.newTrustedTransport())
                    .setJsonFactory(JacksonFactory.getDefaultInstance())
                    .setClientSecrets(clientId, clientSecret)
                    .build()
                    .setFromTokenResponse(tokenResponse);

            credentialStore.put("user", credential);

            return ApiResponse.ok("인증 완료. 이제 메일 전송 가능.");
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "이메일 인증코드 전송", description = "이메일 주소로 인증코드를 전송합니다. (구글 인증 필요)")
    @PostMapping("/send-code")
    public ApiResponse<String> sendCode(@RequestBody SendCodeRequest req) {
        String email = req.getEmail();
        String code = String.format("%06d", new Random().nextInt(999999));
        long expiry = System.currentTimeMillis() + 3 * 60 * 1000; // 3분
        codeStore.put(email, new CodeWithExpiry(code, expiry));
        try {
            Credential credential = credentialStore.get("user");
            gmailService.sendAuthCode(email, code, credential);
            return ApiResponse.ok("이메일 전송 완료");
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "이메일 인증코드 검증", description = "이메일과 인증코드를 받아 검증합니다.")
    @PostMapping("/verify-code")
    public ApiResponse<String> verifyCode(@RequestBody VerifyCodeRequest req) {
        String email = req.getEmail();
        String code = req.getCode();
        CodeWithExpiry cwe = codeStore.get(email);
        if (cwe == null) {
            return ApiResponse.fail("인증코드를 먼저 요청하세요.");
        }
        if (System.currentTimeMillis() > cwe.expiry) {
            codeStore.remove(email);
            return ApiResponse.fail("인증코드가 만료되었습니다.");
        }
        if (!cwe.code.equals(code)) {
            return ApiResponse.fail("인증코드가 일치하지 않습니다.");
        }
        verifiedEmails.add(email);
        codeStore.remove(email);
        return ApiResponse.ok("인증 성공");
    }
}
