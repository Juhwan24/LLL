package com.hrm.hrm.service;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GptServiceImpl implements GptService {
    private final OpenAiService openAiService;

    @Autowired
    public GptServiceImpl(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @Override
    public GptResponse prompt(GptRequest request) {
        CompletionRequest completionRequest = CompletionRequest.builder()
                .prompt(request.getPrompt())
                .model("text-davinci-003")
                .maxTokens(100)
                .build();
        String result = openAiService.createCompletion(completionRequest)
                .getChoices().get(0).getText();
        return new GptResponse(result);
    }
} 