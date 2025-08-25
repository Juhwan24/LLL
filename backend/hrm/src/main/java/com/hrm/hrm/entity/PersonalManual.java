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
 * 개인 매뉴얼 엔티티 - Living Manual의 핵심 데이터
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "personal_manuals")
public class PersonalManual {
    
    @Id
    private UUID id;
    
    /**
     * 매뉴얼 소유자
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    /**
     * 뼈대 데이터 (온보딩 설문 결과) - JSON 형태
     */
    @Column(name = "skeleton_data", columnDefinition = "jsonb")
    private String skeletonData;
    
    /**
     * 근육 데이터 (피드백 누적 결과) - JSON 형태
     */
    @Column(name = "muscle_data", columnDefinition = "jsonb")
    private String muscleData;
    
    /**
     * 뼈대 데이터 가중치 (초기 1.0에서 점차 감소)
     */
    @Column(name = "skeleton_weight", nullable = false)
    @Builder.Default
    private Double skeletonWeight = 1.0;
    
    /**
     * 근육 데이터 가중치 (초기 0.0에서 점차 증가)
     */
    @Column(name = "muscle_weight", nullable = false)
    @Builder.Default
    private Double muscleWeight = 0.0;
    
    /**
     * 총 피드백 수 (가중치 계산용)
     */
    @Column(name = "total_feedback_count", nullable = false)
    @Builder.Default
    private Integer totalFeedbackCount = 0;
    
    /**
     * 최종 신뢰도 점수 (전체 데이터의 품질 지표)
     */
    @Column(name = "reliability_score", nullable = false)
    @Builder.Default
    private Double reliabilityScore = 0.1; // 초기값
    
    /**
     * 매뉴얼 생성 시간
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * 마지막 업데이트 시간
     */
    @Column(name = "last_updated", nullable = false)
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
    
    /**
     * 마지막 AI 처리 시간
     */
    @Column(name = "last_ai_processed")
    private LocalDateTime lastAiProcessed;
    
    /**
     * 매뉴얼 버전 (데이터 스키마 변경 추적용)
     */
    @Column(name = "manual_version")
    @Builder.Default
    private Integer manualVersion = 1;
    
    /**
     * 활성화 상태
     */
    @Column(name = "is_active")
    @Builder.Default
    private boolean isActive = true;
    
    // 비즈니스 메서드들
    
    /**
     * 새로운 피드백 추가 후 가중치 재조정
     */
    public void updateWeightsAfterFeedback() {
        this.totalFeedbackCount++;
        
        // 동적 가중치 재조정 알고리즘
        // reliability_score = 0.1 + (total_feedback_count * 0.1)
        this.reliabilityScore = Math.min(0.1 + (totalFeedbackCount * 0.1), 1.0);
        
        // 뼈대 가중치는 점차 감소 (decay rate = 0.95)
        this.skeletonWeight = Math.max(this.skeletonWeight * 0.95, 0.1);
        
        // 근육 가중치는 기하급수적으로 증가
        this.muscleWeight = Math.min(1.0 - this.skeletonWeight, 0.9);
        
        this.lastUpdated = LocalDateTime.now();
    }
    
    /**
     * 뼈대 데이터 설정 (온보딩 시)
     */
    public void setSkeletonData(String skeletonData) {
        this.skeletonData = skeletonData;
        this.lastUpdated = LocalDateTime.now();
    }
    
    /**
     * 근육 데이터 업데이트 (피드백 처리 후)
     */
    public void updateMuscleData(String muscleData) {
        this.muscleData = muscleData;
        this.lastAiProcessed = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }
    
    /**
     * 데이터 신선도 계산 (일 단위)
     */
    public String getDataFreshness() {
        if (lastUpdated == null) {
            return "unknown";
        }
        
        long daysSinceUpdate = java.time.Duration.between(lastUpdated, LocalDateTime.now()).toDays();
        
        if (daysSinceUpdate <= 7) {
            return "fresh";
        } else if (daysSinceUpdate <= 30) {
            return "moderate";
        } else {
            return "stale";
        }
    }
    
    /**
     * 높은 신뢰도 여부 확인
     */
    public boolean isHighReliability() {
        return reliabilityScore >= 0.7;
    }
    
    /**
     * 충분한 데이터 보유 여부 확인
     */
    public boolean hasSufficientData() {
        return totalFeedbackCount >= 3 && (skeletonData != null || muscleData != null);
    }
    
    /**
     * AI 코칭에 사용 가능한 상태인지 확인
     */
    public boolean isReadyForCoaching() {
        return isActive && hasSufficientData() && reliabilityScore >= 0.3;
    }
    
    /**
     * 정적 팩토리 메서드
     */
    public static PersonalManual create(User user) {
        return PersonalManual.builder()
            .id(UUID.randomUUID())
            .user(user)
            .skeletonWeight(1.0)
            .muscleWeight(0.0)
            .totalFeedbackCount(0)
            .reliabilityScore(0.1)
            .createdAt(LocalDateTime.now())
            .lastUpdated(LocalDateTime.now())
            .manualVersion(1)
            .isActive(true)
            .build();
    }
    
    /**
     * 온보딩 데이터와 함께 생성
     */
    public static PersonalManual createWithOnboarding(User user, String skeletonData) {
        PersonalManual manual = create(user);
        manual.skeletonData = skeletonData;
        return manual;
    }
}
