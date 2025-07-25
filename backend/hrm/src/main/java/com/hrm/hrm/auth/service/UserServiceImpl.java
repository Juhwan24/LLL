package com.hrm.hrm.auth.service;

import com.hrm.hrm.auth.dto.UserSignUpRequest;
import com.hrm.hrm.entity.User;
import com.hrm.hrm.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import com.hrm.hrm.auth.dto.UserLoginRequest;
import com.hrm.hrm.auth.dto.UserLoginResponse;
import com.hrm.hrm.util.JwtUtil;
import com.hrm.hrm.auth.dto.CompanySignUpRequest;
import com.hrm.hrm.auth.controller.AuthController;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void signUp(UserSignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 이메일 인증 여부 확인
        if (!AuthController.verifiedEmails.contains(request.getEmail())) {
            throw new IllegalArgumentException("이메일 인증이 필요합니다.");
        }
        User user = User.createPersonalUser(
            request.getUserName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getUserType(),
            true, // 인증됨
            LocalDateTime.now()
        );
        userRepository.save(user);
        // 회원가입 후 인증된 이메일 목록에서 제거
        AuthController.verifiedEmails.remove(request.getEmail());
    }

    public void signUp(CompanySignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        // 이메일 인증 여부 확인
        if (!AuthController.verifiedEmails.contains(request.getEmail())) {
            throw new IllegalArgumentException("이메일 인증이 필요합니다.");
        }
        User user = User.createCompanyUser(
            request.getUserName(),
            request.getCompanyName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getUserType(),
            true, // 인증됨
            LocalDateTime.now()
        );
        userRepository.save(user);
        // 회원가입 후 인증된 이메일 목록에서 제거
        AuthController.verifiedEmails.remove(request.getEmail());
    }

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        // JWT 토큰 생성
        String displayName = user.getUserName() != null ? user.getUserName() : user.getCompanyName();
        String token = JwtUtil.createToken(user.getEmail(), displayName);
        return UserLoginResponse.builder()
            .email(user.getEmail())
            .name(displayName)
            .message("로그인 성공")
            .token(token)
            .build();
    }

    // changePassword 메서드 구현 삭제
} 
