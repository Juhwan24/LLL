package com.hrm.hrm.service;

import com.hrm.hrm.dto.UserSignUpRequest;
import com.hrm.hrm.dto.UserLoginRequest;
import com.hrm.hrm.dto.UserLoginResponse;
import com.hrm.hrm.dto.CompanySignUpRequest;

public interface UserService {
    void signUp(UserSignUpRequest request);
    void signUp(CompanySignUpRequest request);
    UserLoginResponse login(UserLoginRequest request);
    void changePassword(String email, String oldPassword, String newPassword);
} 