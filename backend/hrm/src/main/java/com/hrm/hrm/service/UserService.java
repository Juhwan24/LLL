package com.hrm.hrm.service;

import com.hrm.hrm.dto.UserSignUpRequest;
import com.hrm.hrm.dto.UserLoginRequest;
import com.hrm.hrm.dto.UserLoginResponse;

public interface UserService {
    void signUp(UserSignUpRequest request);
    UserLoginResponse login(UserLoginRequest request);
} 