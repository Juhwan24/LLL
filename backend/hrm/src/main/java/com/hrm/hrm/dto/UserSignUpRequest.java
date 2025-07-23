package com.hrm.hrm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignUpRequest {
    private String name;
    private String email;
    private String password;
    private String userType; // CORPORATE or INDIVIDUAL
} 