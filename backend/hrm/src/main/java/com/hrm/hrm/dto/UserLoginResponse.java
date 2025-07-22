package com.hrm.hrm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
public class UserLoginResponse {
    private String email;
    private String name;
    private String message;
    private String token;

    public UserLoginResponse(String email, String name, String message, String token) {
        this.email = email;
        this.name = name;
        this.message = message;
        this.token = token;
    }
} 
