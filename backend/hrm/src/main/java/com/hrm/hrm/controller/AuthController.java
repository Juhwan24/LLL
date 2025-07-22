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

    @PostMapping("/send-code")
    @ResponseBody
    public Map<String, Object> sendCode(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String code = String.format("%06d", new Random().nextInt(999999));

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
}