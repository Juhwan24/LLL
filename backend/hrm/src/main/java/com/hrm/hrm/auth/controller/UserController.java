package com.hrm.hrm.auth.controller;

import com.hrm.hrm.auth.dto.UserSignUpRequest;
import com.hrm.hrm.auth.dto.UserLoginRequest;
import com.hrm.hrm.auth.dto.UserLoginResponse;
import com.hrm.hrm.auth.dto.CompanySignUpRequest;
import com.hrm.hrm.auth.service.UserService;
import com.hrm.hrm.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "회원 관련 API")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "개인 회원가입", description = "개인 회원 정보를 입력받아 회원가입을 처리합니다.")
    @PostMapping("/signup/personal")
    public ApiResponse<Void> signUpPersonal(@RequestBody UserSignUpRequest request) {
        try {
            userService.signUp(request);
            return ApiResponse.ok(null);
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "기업 회원가입", description = "기업 회원 정보를 입력받아 회원가입을 처리합니다.")
    @PostMapping("/signup/company")
    public ApiResponse<Void> signUpCompany(@RequestBody CompanySignUpRequest request) {
        try {
            userService.signUp(request);
            return ApiResponse.ok(null);
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }

    @Operation(summary = "로그인", description = "이메일, 비밀번호로 로그인. 성공 시 JWT 토큰 반환")
    @PostMapping("/login")
    public ApiResponse<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        try {
            UserLoginResponse response = userService.login(request);
            return ApiResponse.ok(response);
        } catch (Exception e) {
            return ApiResponse.fail(e.getMessage());
        }
    }
} 
