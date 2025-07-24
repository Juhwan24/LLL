package com.hrm.hrm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.AccessLevel;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String password;

    @Column(name = "user_name")
    private String userName; // 개인 회원 이름

    @Column(name = "company_name")
    private String companyName; // 기업 회원 이름

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDate birthDate;

    @Column(name = "user_type", nullable = false)
    private String userType; // CORPORATE or INDIVIDUAL

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "user")
    private List<UserTeam> userTeams;

    // 정적 팩토리 메서드
    public static User createPersonalUser(String userName, String email, String password, String userType, boolean emailVerified, LocalDateTime createdAt) {
        return User.builder()
                .id(UUID.randomUUID())
                .userName(userName)
                .companyName(null)
                .email(email)
                .password(password)
                .userType(userType)
                .emailVerified(emailVerified)
                .createdAt(createdAt)
                .build();
    }

    public static User createCompanyUser(String userName, String companyName, String email, String password, String userType, boolean emailVerified, LocalDateTime createdAt) {
        return User.builder()
                .id(UUID.randomUUID())
                .userName(userName)
                .companyName(companyName)
                .email(email)
                .password(password)
                .userType(userType)
                .emailVerified(emailVerified)
                .createdAt(createdAt)
                .build();
    }
} 
