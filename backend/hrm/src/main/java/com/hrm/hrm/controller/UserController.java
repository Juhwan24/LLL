package com.hrm.hrm.controller;

import com.hrm.hrm.dto.UserSignUpRequest;
import com.hrm.hrm.dto.UserLoginRequest;
import com.hrm.hrm.dto.UserLoginResponse;
import com.hrm.hrm.dto.UserSignUpRequest;
import com.hrm.hrm.dto.CompanySignUpRequest;
import com.hrm.hrm.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Operation(summary = "회원가입", description = "이름, 이메일, 비밀번호, 회원유형(기업/개인)으로 회원가입")
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserSignUpRequest request) {
        userService.signUp(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "개인 회원가입", description = "개인 회원 정보를 입력받아 회원가입을 처리합니다.")
    @PostMapping("/signup/personal")
    public ResponseEntity<?> signUpPersonal(@RequestBody UserSignUpRequest request) {
        userService.signUp(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "기업 회원가입", description = "기업 회원 정보를 입력받아 회원가입을 처리합니다.")
    @PostMapping("/signup/company")
    public ResponseEntity<?> signUpCompany(@RequestBody CompanySignUpRequest request) {
        userService.signUp(request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "로그인", description = "이메일, 비밀번호로 로그인. 성공 시 JWT 토큰 반환")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        UserLoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
} 
