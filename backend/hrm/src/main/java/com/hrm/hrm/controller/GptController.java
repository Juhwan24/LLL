package com.hrm.hrm.controller;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;
import com.hrm.hrm.service.GptService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gpt")
public class GptController {
    private final GptService gptService;

    @Autowired
    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    @Operation(summary = "GPT 프롬프트 요청", description = "/api/gpt/prompt 엔드포인트로 프롬프트를 전달하면 GPT 응답을 반환합니다.")
    @PostMapping("/prompt")
    public ResponseEntity<GptResponse> prompt(@RequestBody GptRequest request) {
        GptResponse response = gptService.prompt(request);
        return ResponseEntity.ok(response);
    }
} 