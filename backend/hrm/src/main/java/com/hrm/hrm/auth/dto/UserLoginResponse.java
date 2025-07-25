package com.hrm.hrm.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.Value;

@Value
@Builder
public class UserLoginResponse {
    String email;
    String name;
    String message;
    String token;
} 
