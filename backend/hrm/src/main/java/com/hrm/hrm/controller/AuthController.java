package com.hrm.hrm.controller;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Map<String, Credential> credentialStore = new HashMap<>();
    // ... (구글 OAuth 인증, 콜백, 인증코드 전송 등 메서드 구현)
} 