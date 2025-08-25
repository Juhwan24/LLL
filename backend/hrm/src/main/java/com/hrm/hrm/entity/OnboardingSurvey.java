package com.hrm.hrm.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 온보딩 설문 엔티티
 * 신규 입사자의 초기 성향 데이터 수집
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "onboarding_surveys")
public class OnboardingSurvey {
    
    @Id
    private UUID id;
    
    /**
     * 설문 대상 사용자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * 설문 결과 (JSON 형태의 객관식 응답)
     */
    @Column(name = "survey_result", columnDefinition = "jsonb", nullable = false)
    private String surveyResult;
    
    /**
     * 변환된 성격 태그들 (뼈대 데이터) - JSON 형태
     */
    @Column(name = "personality_tags", columnDefinition = "jsonb")
    private String personalityTags;
    
    /**
     * 설문 신뢰도 점수
     */
    @Column(name = "reliability_score", nullable = false)
    @Builder.Default
    private Double reliabilityScore = 1.0; // 초기값 1.0
    
    /**
     * 설문 버전 (설문지 변경 추적용)
     */
    @Column(name = "survey_version")
    @Builder.Default
    private Integer surveyVersion = 1;
    
    /**
     * 설문 완료 시간
     */
    @Column(name = "completed_at", nullable = false)
    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
    
    /**
     * 설문 처리 상태 (PENDING, PROCESSED, FAILED)
     */
    @Column(name = "processing_status")
    @Builder.Default
    private String processingStatus = "PENDING";
    
    /**
     * 처리 완료 시간
     */
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    /**
     * 설문 소요 시간 (분)
     */
    @Column(name = "completion_time_minutes")
    private Integer completionTimeMinutes;
    
    // 비즈니스 메서드들
    
    /**
     * 성격 태그 설정 (처리 완료)
     */
    public void setPersonalityTags(String personalityTags) {
        this.personalityTags = personalityTags;
        this.processingStatus = "PROCESSED";
        this.processedAt = LocalDateTime.now();
    }
    
    /**
     * 처리 실패 설정
     */
    public void markProcessingFailed() {
        this.processingStatus = "FAILED";
        this.processedAt = LocalDateTime.now();
    }
    
    /**
     * 처리 완료 여부 확인
     */
    public boolean isProcessed() {
        return "PROCESSED".equals(processingStatus);
    }
    
    /**
     * 신뢰도 업데이트 (시간에 따른 감소)
     */
    public void updateReliabilityScore(double decayRate) {
        this.reliabilityScore = Math.max(this.reliabilityScore * decayRate, 0.1);
    }
    
    /**
     * 설문 데이터 유효성 확인
     */
    public boolean isValid() {
        return surveyResult != null && !surveyResult.trim().isEmpty()
            && reliabilityScore != null && reliabilityScore > 0;
    }
    
    /**
     * 정적 팩토리 메서드
     */
    public static OnboardingSurvey create(User user, String surveyResult, 
                                         Integer completionTimeMinutes, Integer surveyVersion) {
        return OnboardingSurvey.builder()
            .id(UUID.randomUUID())
            .user(user)
            .surveyResult(surveyResult)
            .completionTimeMinutes(completionTimeMinutes)
            .surveyVersion(surveyVersion)
            .reliabilityScore(1.0)
            .completedAt(LocalDateTime.now())
            .processingStatus("PENDING")
            .build();
    }
}
