package com.hrm.hrm.auth.service;

import com.hrm.hrm.auth.dto.UserSignUpRequest;
import com.hrm.hrm.auth.dto.UserLoginRequest;
import com.hrm.hrm.auth.dto.UserLoginResponse;
import com.hrm.hrm.auth.dto.CompanySignUpRequest;

public interface UserService {
    void signUp(UserSignUpRequest request);
    void signUp(CompanySignUpRequest request);
    UserLoginResponse login(UserLoginRequest request);
} 
