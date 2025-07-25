package com.hrm.hrm.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Value
@Builder
public class SendCodeRequest {
    String email;
} 
