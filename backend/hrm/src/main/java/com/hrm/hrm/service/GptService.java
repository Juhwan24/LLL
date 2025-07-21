package com.hrm.hrm.service;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GptService {

    private final OpenAiService openAiService;

    @Autowired
    public GptService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    public GptResponse getGptResponse(GptRequest gptRequest) {
        CompletionRequest completionRequest = CompletionRequest.builder()
                .prompt(gptRequest.getQuestion())
                .model("gpt-3.5-turbo-instruct")
                .maxTokens(200)
                .build();

        String answer = openAiService.createCompletion(completionRequest).getChoices().get(0).getText();
        
        GptResponse gptResponse = new GptResponse();
        gptResponse.setAnswer(answer);
        gptResponse.setMessage("gpt api가 정상적으로 작동중입니다람쥐썬더더");

        return gptResponse;
    }
} 