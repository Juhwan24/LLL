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
 * 동료 피드백 엔티티
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "peer_feedbacks")
public class PeerFeedback {
    
    @Id
    private UUID id;
    
    /**
     * 피드백 제공자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;
    
    /**
     * 피드백 대상자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;
    
    /**
     * 원본 피드백 텍스트
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String feedbackText;
    
    /**
     * AI 처리 결과 (구조화된 태그들) - JSON 형태
     */
    @Column(name = "structured_tags", columnDefinition = "jsonb")
    private String structuredTags;
    
    /**
     * 프로젝트 컨텍스트
     */
    @Column(name = "project_context")
    private String projectContext;
    
    /**
     * 피드백 카테고리 (업무능력, 소통능력, 리더십 등)
     */
    @Column(name = "feedback_category")
    private String feedbackCategory;
    
    /**
     * 처리 상태 (PENDING, PROCESSING, COMPLETED, FAILED)
     */
    @Column(name = "processing_status", nullable = false)
    @Builder.Default
    private String processingStatus = "PENDING";
    
    /**
     * AI 처리 시 사용된 캐시 키
     */
    @Column(name = "cache_key")
    private String cacheKey;
    
    /**
     * AI 처리 관련 메타데이터 - JSON 형태
     */
    @Column(name = "processing_metadata", columnDefinition = "jsonb")
    private String processingMetadata;
    
    /**
     * 피드백 생성 시간
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * AI 처리 완료 시간
     */
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    /**
     * 피드백 가중치 (신뢰도, 중요도 등을 고려한 점수)
     */
    @Column(name = "feedback_weight")
    @Builder.Default
    private Double feedbackWeight = 1.0;
    
    /**
     * 공개 여부 (익명 피드백인지)
     */
    @Column(name = "is_anonymous")
    @Builder.Default
    private boolean isAnonymous = false;
    
    // 비즈니스 메서드들
    
    /**
     * 처리 상태 업데이트
     */
    public void updateProcessingStatus(String status) {
        this.processingStatus = status;
        if ("COMPLETED".equals(status) || "FAILED".equals(status)) {
            this.processedAt = LocalDateTime.now();
        }
    }
    
    /**
     * AI 처리 결과 업데이트
     */
    public void updateProcessingResult(String structuredTags, String cacheKey, String metadata) {
        this.structuredTags = structuredTags;
        this.cacheKey = cacheKey;
        this.processingMetadata = metadata;
        updateProcessingStatus("COMPLETED");
    }
    
    /**
     * 처리 완료 여부 확인
     */
    public boolean isProcessed() {
        return "COMPLETED".equals(processingStatus);
    }
    
    /**
     * 처리 실패 여부 확인
     */
    public boolean isFailed() {
        return "FAILED".equals(processingStatus);
    }
    
    /**
     * 처리 대기 중 여부 확인
     */
    public boolean isPending() {
        return "PENDING".equals(processingStatus) || "PROCESSING".equals(processingStatus);
    }
    
    /**
     * 정적 팩토리 메서드
     */
    public static PeerFeedback create(User fromUser, User toUser, String feedbackText, 
                                     String projectContext, String category) {
        return PeerFeedback.builder()
            .id(UUID.randomUUID())
            .fromUser(fromUser)
            .toUser(toUser)
            .feedbackText(feedbackText)
            .projectContext(projectContext)
            .feedbackCategory(category)
            .processingStatus("PENDING")
            .createdAt(LocalDateTime.now())
            .feedbackWeight(1.0)
            .isAnonymous(false)
            .build();
    }
    
    /**
     * 익명 피드백 생성
     */
    public static PeerFeedback createAnonymous(User toUser, String feedbackText, 
                                              String projectContext, String category) {
        return PeerFeedback.builder()
            .id(UUID.randomUUID())
            .fromUser(null) // 익명의 경우 null
            .toUser(toUser)
            .feedbackText(feedbackText)
            .projectContext(projectContext)
            .feedbackCategory(category)
            .processingStatus("PENDING")
            .createdAt(LocalDateTime.now())
            .feedbackWeight(0.8) // 익명 피드백은 가중치 조금 낮춤
            .isAnonymous(true)
            .build();
    }
}
