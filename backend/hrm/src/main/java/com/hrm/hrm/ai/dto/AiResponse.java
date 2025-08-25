package com.hrm.hrm.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

/**
 * AI 파이프라인 응답 DTO (강화 버전)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiResponse {
    
    /**
     * 처리 성공 여부
     */
    private boolean success;
    
    /**
     * 분류 결과 목록 (파이프라인 1 강화 결과)
     */
    private List<ClassificationResult> classificationResults;
    
    /**
     * 구조화된 태그 목록 (하위 호환성 유지)
     */
    @Deprecated
    private List<StructuredTag> structuredTags;
    
    /**
     * 텍스트 요약
     */
    private String summary;
    
    /**
     * 생성된 가설 목록 (파이프라인 2 결과)
     */
    private List<String> hypotheses;
    
    /**
     * 선택된 최적 가설
     */
    private String bestHypothesis;
    
    /**
     * 최종 코칭 카드
     */
    private CoachingCard coachingCard;
    
    /**
     * 분류 통계 정보
     */
    private Map<String, Object> statistics;
    
    /**
     * 데이터 품질 정보
     */
    private Map<String, Object> dataQuality;
    
    /**
     * 처리 정보 (메타데이터)
     */
    private Map<String, Object> processingInfo;
    
    /**
     * 캐시 키 (중복 처리 방지용)
     */
    private String cacheKey;
    
    /**
     * 원본 AI 응답 (디버깅용)
     */
    private String rawOutput;
    
    /**
     * 오류 메시지
     */
    private String errorMessage;
    
    /**
     * 오류 타입
     */
    private String errorType;
    
    /**
     * 처리 시간 (밀리초)
     */
    private Long processingTimeMs;
    
    /**
     * 응답 생성 시간
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    /**
     * 상관관계 ID
     */
    private String correlationId;
    
    /**
     * 오류 응답 생성 헬퍼 메서드
     */
    public static AiResponse error(String message, String correlationId) {
        return AiResponse.builder()
            .success(false)
            .errorMessage(message)
            .correlationId(correlationId)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    /**
     * 오류 응답 생성 헬퍼 메서드 (예외 포함)
     */
    public static AiResponse error(String message, Exception e, String correlationId) {
        return AiResponse.builder()
            .success(false)
            .errorMessage(message)
            .errorType(e.getClass().getSimpleName())
            .correlationId(correlationId)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    /**
     * 성공 응답 생성 헬퍼 메서드 (파이프라인 1용)
     */
    public static AiResponse successForPipeline1(List<StructuredTag> tags, String summary, 
                                                String cacheKey, String correlationId) {
        return AiResponse.builder()
            .success(true)
            .structuredTags(tags)
            .summary(summary)
            .cacheKey(cacheKey)
            .correlationId(correlationId)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    /**
     * 성공 응답 생성 헬퍼 메서드 (파이프라인 2용)
     */
    public static AiResponse successForPipeline2(List<String> hypotheses, String bestHypothesis,
                                                CoachingCard coachingCard, String correlationId) {
        return AiResponse.builder()
            .success(true)
            .hypotheses(hypotheses)
            .bestHypothesis(bestHypothesis)
            .coachingCard(coachingCard)
            .correlationId(correlationId)
            .timestamp(LocalDateTime.now())
            .build();
    }
}
