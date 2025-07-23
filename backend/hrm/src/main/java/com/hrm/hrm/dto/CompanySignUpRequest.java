package com.hrm.hrm.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanySignUpRequest {
    private String name;
    private String companyName;
    private String email;
    private String password;
    private String userType; // company
} 