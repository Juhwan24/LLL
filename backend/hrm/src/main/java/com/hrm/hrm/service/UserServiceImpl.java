package com.hrm.hrm.service;

import com.hrm.hrm.dto.UserSignUpRequest;
import com.hrm.hrm.entity.User;
import com.hrm.hrm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import com.hrm.hrm.dto.UserLoginRequest;
import com.hrm.hrm.dto.UserLoginResponse;
import com.hrm.hrm.util.JwtUtil;
import com.hrm.hrm.dto.PersonalSignUpRequest;
import com.hrm.hrm.dto.CompanySignUpRequest;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void signUp(PersonalSignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        User user = User.createPersonalUser(
            request.getUserName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getUserType(),
            false,
            LocalDateTime.now()
        );
        userRepository.save(user);
    }

    public void signUp(CompanySignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        User user = User.createCompanyUser(
            request.getName(),
            request.getCompanyName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()),
            request.getUserType(),
            false,
            LocalDateTime.now()
        );
        userRepository.save(user);
    }

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        // JWT 토큰 생성
        String token = JwtUtil.createToken(user.getEmail(), user.getName());
        return new UserLoginResponse(user.getEmail(), user.getName(), "로그인 성공", token);
    }
} 
