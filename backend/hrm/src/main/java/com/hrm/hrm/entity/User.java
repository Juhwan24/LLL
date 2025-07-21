package com.hrm.hrm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

/**
 * 사용자 정보를 담는 엔티티 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_users") // 'user'는 PostgreSQL에서 예약어일 수 있으므로 'app_users'로 지정
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 ID를 자동으로 생성하도록 설정
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @CreationTimestamp // 데이터 생성 시 자동으로 현재 시간 기록
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
} 