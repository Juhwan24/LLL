package com.hrm.hrm.controller;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.hrm.hrm.service.GmailService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.*;
import io.swagger.v3.oas.annotations.Operation;
import com.hrm.hrm.dto.SendCodeRequest;
import com.hrm.hrm.dto.VerifyCodeRequest;

@Controller
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
    @ResponseBody
    public Map<String, Object> handleGoogleCallback(@RequestParam("code") String code) {
        Map<String, Object> res = new HashMap<>();
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

            res.put("success", true);
            res.put("message", "인증 완료. 이제 메일 전송 가능.");
        } catch (Exception e) {
            res.put("success", false);
            res.put("error", e.getMessage());
        }
        return res;
    }

    @Operation(summary = "이메일 인증코드 전송", description = "이메일 주소로 인증코드를 전송합니다. (구글 인증 필요)")
    @PostMapping("/send-code")
    @ResponseBody
    public Map<String, Object> sendCode(@RequestBody SendCodeRequest req) {
        String email = req.getEmail();
        String code = String.format("%06d", new Random().nextInt(999999));
        long expiry = System.currentTimeMillis() + 3 * 60 * 1000; // 3분
        codeStore.put(email, new CodeWithExpiry(code, expiry));
        Map<String, Object> res = new HashMap<>();
        try {
            Credential credential = credentialStore.get("user");
            gmailService.sendAuthCode(email, code, credential);
            res.put("success", true);
            res.put("message", "이메일 전송 완료");
        } catch (Exception e) {
            res.put("success", false);
            res.put("error", e.getMessage());
        }
        return res;
    }

    @Operation(summary = "이메일 인증코드 검증", description = "이메일과 인증코드를 받아 검증합니다.")
    @PostMapping("/verify-code")
    @ResponseBody
    public Map<String, Object> verifyCode(@RequestBody VerifyCodeRequest req) {
        String email = req.getEmail();
        String code = req.getCode();
        Map<String, Object> res = new HashMap<>();
        CodeWithExpiry cwe = codeStore.get(email);
        if (cwe == null) {
            res.put("success", false);
            res.put("error", "인증코드를 먼저 요청하세요.");
            return res;
        }
        if (System.currentTimeMillis() > cwe.expiry) {
            codeStore.remove(email);
            res.put("success", false);
            res.put("error", "인증코드가 만료되었습니다.");
            return res;
        }
        if (!cwe.code.equals(code)) {
            res.put("success", false);
            res.put("error", "인증코드가 일치하지 않습니다.");
            return res;
        }
        verifiedEmails.add(email);
        codeStore.remove(email);
        res.put("success", true);
        res.put("message", "인증 성공");
        return res;
    }
}
