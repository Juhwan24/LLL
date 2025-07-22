package com.hrm.hrm.service;

import com.hrm.hrm.dto.GptRequest;
import com.hrm.hrm.dto.GptResponse;

public interface GptService {
    GptResponse prompt(GptRequest request);
} 