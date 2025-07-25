package com.hrm.hrm.gpt.service;

import com.hrm.hrm.auth.dto.GptRequest;
import com.hrm.hrm.auth.dto.GptResponse;

public interface GptService {
    GptResponse prompt(GptRequest request);
} 
