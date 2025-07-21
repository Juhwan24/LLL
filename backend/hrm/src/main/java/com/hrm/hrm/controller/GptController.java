package com.hrm.hrm.controller;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;
import com.hrm.hrm.service.GptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gpt")
public class GptController {

    private final GptService gptService;

    @Autowired
    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    @PostMapping("/question")
    public GptResponse sendQuestion(@RequestBody GptRequest gptRequest) {
        return gptService.getGptResponse(gptRequest);
    }
} 