package com.hrm.hrm.controller;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;
import com.hrm.hrm.service.GptService;
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

    @PostMapping("/prompt")
    public ResponseEntity<GptResponse> prompt(@RequestBody GptRequest request) {
        GptResponse response = gptService.prompt(request);
        return ResponseEntity.ok(response);
    }
} 