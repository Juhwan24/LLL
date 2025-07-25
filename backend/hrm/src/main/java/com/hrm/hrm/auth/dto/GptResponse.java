package com.hrm.hrm.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Value
@Builder
@AllArgsConstructor
public class GptResponse {
    String result;
} 
