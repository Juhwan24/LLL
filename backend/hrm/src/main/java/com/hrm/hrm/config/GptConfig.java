package com.hrm.hrm.config;

import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GptConfig {
    @Bean
    public OpenAiService openAiService(@Value("${openai.api.key}") String apiKey) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("openai.api.key 값이 필요합니다.");
        }
        return new OpenAiService(apiKey);
    }
}