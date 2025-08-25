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
 * MCP (Model Control Protocol) 세션 엔티티
 * AI 코칭 생성 과정의 전체 기록을 저장
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "mcp_sessions")
public class McpSession {
    
    @Id
    private UUID id;
    
    /**
     * 질문한 관리자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id", nullable = false)
    private User manager;
    
    /**
     * 분석 대상 직원
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id", nullable = false)
    private User targetUser;
    
    /**
     * 관리자의 원본 질문
     */
    @Column(name = "user_query", columnDefinition = "TEXT", nullable = false)
    private String userQuery;
    
    /**
     * 분석된 의도 (burnout_care, performance_review 등)
     */
    @Column(name = "analyzed_intent")
    private String analyzedIntent;
    
    /**
     * 전체 MCP 패킷 (JSON 형태)
     */
    @Column(name = "mcp_packet", columnDefinition = "jsonb")
    private String mcpPacket;
    
    /**
     * AI가 생성한 가설들 (JSON 배열)
     */
    @Column(name = "generated_hypotheses", columnDefinition = "jsonb")
    private String generatedHypotheses;
    
    /**
     * 선택된 최적 가설
     */
    @Column(name = "best_hypothesis", columnDefinition = "TEXT")
    private String bestHypothesis;
    
    /**
     * 최종 코칭 카드 (JSON 형태)
     */
    @Column(name = "final_coaching_card", columnDefinition = "jsonb")
    private String finalCoachingCard;
    
    /**
     * 처리 상태 (PENDING, PROCESSING, COMPLETED, FAILED)
     */
    @Column(name = "processing_status", nullable = false)
    @Builder.Default
    private String processingStatus = "PENDING";
    
    /**
     * AI 처리 관련 메타데이터 (사용 모델, 토큰 수, 처리 시간 등)
     */
    @Column(name = "processing_metadata", columnDefinition = "jsonb")
    private String processingMetadata;
    
    /**
     * 최종 신뢰도 점수
     */
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    /**
     * 세션 생성 시간
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * 처리 완료 시간
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    /**
     * 상관관계 ID (로깅 추적용)
     */
    @Column(name = "correlation_id")
    private String correlationId;
    
    /**
     * 세션 소요 시간 (밀리초)
     */
    @Column(name = "processing_duration_ms")
    private Long processingDurationMs;
    
    /**
     * 오류 메시지 (실패 시)
     */
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    /**
     * 관리자 피드백 (코칭 카드 사용 후 평가)
     */
    @Column(name = "manager_feedback")
    private String managerFeedback;
    
    /**
     * 관리자 평점 (1-5점)
     */
    @Column(name = "manager_rating")
    private Integer managerRating;
    
    // 비즈니스 메서드들
    
    /**
     * 처리 시작
     */
    public void startProcessing(String correlationId) {
        this.processingStatus = "PROCESSING";
        this.correlationId = correlationId;
    }
    
    /**
     * 처리 완료
     */
    public void completeProcessing(String bestHypothesis, String coachingCard, 
                                  Double confidenceScore, String metadata) {
        this.bestHypothesis = bestHypothesis;
        this.finalCoachingCard = coachingCard;
        this.confidenceScore = confidenceScore;
        this.processingMetadata = metadata;
        this.processingStatus = "COMPLETED";
        this.completedAt = LocalDateTime.now();
        
        if (this.createdAt != null) {
            this.processingDurationMs = java.time.Duration.between(
                this.createdAt, this.completedAt).toMillis();
        }
    }
    
    /**
     * 처리 실패
     */
    public void failProcessing(String errorMessage, String metadata) {
        this.errorMessage = errorMessage;
        this.processingMetadata = metadata;
        this.processingStatus = "FAILED";
        this.completedAt = LocalDateTime.now();
        
        if (this.createdAt != null) {
            this.processingDurationMs = java.time.Duration.between(
                this.createdAt, this.completedAt).toMillis();
        }
    }
    
    /**
     * 관리자 피드백 추가
     */
    public void addManagerFeedback(String feedback, Integer rating) {
        this.managerFeedback = feedback;
        this.managerRating = rating;
    }
    
    /**
     * 처리 완료 여부 확인
     */
    public boolean isCompleted() {
        return "COMPLETED".equals(processingStatus);
    }
    
    /**
     * 처리 실패 여부 확인
     */
    public boolean isFailed() {
        return "FAILED".equals(processingStatus);
    }
    
    /**
     * 높은 신뢰도 세션 여부 확인
     */
    public boolean isHighConfidence() {
        return confidenceScore != null && confidenceScore >= 0.7;
    }
    
    /**
     * 성공한 세션 여부 확인 (완료 + 적절한 신뢰도)
     */
    public boolean isSuccessful() {
        return isCompleted() && confidenceScore != null && confidenceScore >= 0.3;
    }
    
    /**
     * 정적 팩토리 메서드
     */
    public static McpSession create(User manager, User targetUser, String userQuery, 
                                   String analyzedIntent, String mcpPacket) {
        return McpSession.builder()
            .id(UUID.randomUUID())
            .manager(manager)
            .targetUser(targetUser)
            .userQuery(userQuery)
            .analyzedIntent(analyzedIntent)
            .mcpPacket(mcpPacket)
            .processingStatus("PENDING")
            .createdAt(LocalDateTime.now())
            .build();
    }
}
