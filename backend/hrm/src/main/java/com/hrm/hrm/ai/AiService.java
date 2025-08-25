package com.hrm.hrm.ai;

import com.hrm.hrm.ai.dto.*;
import com.hrm.hrm.ai.exception.AiProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.MeterRegistry;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * AI 서비스 - Python 파이프라인과의 고수준 인터페이스
 */
@Slf4j
@Service
public class AiService {
    
    private final PythonBridge pythonBridge;
    private final MeterRegistry meterRegistry;
    
    // 메트릭 카운터들
    private final Counter feedbackProcessingSuccessCounter;
    private final Counter feedbackProcessingFailureCounter;
    private final Counter coachingGenerationSuccessCounter;
    private final Counter coachingGenerationFailureCounter;
    private final Timer feedbackProcessingTimer;
    private final Timer coachingGenerationTimer;
    
    @Autowired
    public AiService(PythonBridge pythonBridge, MeterRegistry meterRegistry) {
        this.pythonBridge = pythonBridge;
        this.meterRegistry = meterRegistry;
        
        // 메트릭 초기화
        this.feedbackProcessingSuccessCounter = Counter.builder("ai.feedback.processing.success")
            .description("Successful feedback processing operations")
            .register(meterRegistry);
            
        this.feedbackProcessingFailureCounter = Counter.builder("ai.feedback.processing.failure")
            .description("Failed feedback processing operations")
            .tag("error_type", "")
            .register(meterRegistry);
            
        this.coachingGenerationSuccessCounter = Counter.builder("ai.coaching.generation.success")
            .description("Successful coaching generation operations")
            .register(meterRegistry);
            
        this.coachingGenerationFailureCounter = Counter.builder("ai.coaching.generation.failure")
            .description("Failed coaching generation operations")
            .tag("error_type", "")
            .register(meterRegistry);
            
        this.feedbackProcessingTimer = Timer.builder("ai.feedback.processing.duration")
            .description("Time spent processing feedback")
            .register(meterRegistry);
            
        this.coachingGenerationTimer = Timer.builder("ai.coaching.generation.duration")
            .description("Time spent generating coaching responses")
            .register(meterRegistry);
    }
    
    /**
     * 피드백 텍스트를 구조화된 태그로 변환 (비동기)
     */
    @Async
    public CompletableFuture<AiResponse> processFeedbackAsync(String feedbackText, String context) {
        return CompletableFuture.supplyAsync(() -> processFeedback(feedbackText, context));
    }
    
    /**
     * 피드백 텍스트를 구조화된 태그로 변환 (동기)
     */
    @Cacheable(value = "feedback_processing", 
               key = "T(java.util.Objects).hash(#feedbackText, #context)",
               condition = "#feedbackText.length() < 500") // 짧은 텍스트만 캐싱
    public AiResponse processFeedback(String feedbackText, String context) {
        String correlationId = generateCorrelationId("feedback");
        
        return Timer.Sample.start(meterRegistry)
            .stop(feedbackProcessingTimer.wrap(() -> {
                try {
                    log.info("피드백 처리 시작 (correlationId: {})", correlationId);
                    
                    AiRequest request = AiRequest.builder()
                        .script("pipeline1_living_manual.py")
                        .inputText(feedbackText)
                        .context(context)
                        .correlationId(correlationId)
                        .retryEnabled(true)
                        .maxRetries(3)
                        .timeoutSeconds(30)
                        .build();
                    
                    AiResponse response = pythonBridge.executeScript(request);
                    
                    if (response.isSuccess()) {
                        feedbackProcessingSuccessCounter.increment();
                        log.info("피드백 처리 완료 - 태그 {}개 생성 (correlationId: {})", 
                            response.getStructuredTags() != null ? response.getStructuredTags().size() : 0,
                            correlationId);
                    } else {
                        feedbackProcessingFailureCounter.increment();
                        log.warn("피드백 처리 실패: {} (correlationId: {})", 
                            response.getErrorMessage(), correlationId);
                    }
                    
                    return response;
                    
                } catch (AiProcessingException e) {
                    feedbackProcessingFailureCounter.increment();
                    log.error("피드백 처리 예외 (correlationId: {}): {}", correlationId, e.getMessage());
                    return AiResponse.error("피드백 처리 중 오류 발생: " + e.getMessage(), e, correlationId);
                }
            }));
    }
    
    /**
     * MCP 기반 코칭 가설 및 카드 생성
     */
    public AiResponse generateCoachingResponse(Map<String, Object> mcpPacket) {
        String correlationId = generateCorrelationId("coaching");
        
        return Timer.Sample.start(meterRegistry)
            .stop(coachingGenerationTimer.wrap(() -> {
                try {
                    log.info("코칭 생성 시작 (correlationId: {})", correlationId);
                    
                    // MCP 패킷을 JSON 문자열로 변환
                    String mcpPacketJson = objectMapperToJson(mcpPacket);
                    
                    AiRequest request = AiRequest.builder()
                        .script("pipeline2_coaching_generation.py")
                        .inputText(mcpPacketJson)
                        .correlationId(correlationId)
                        .retryEnabled(true)
                        .maxRetries(2) // 코칭 생성은 재시도 횟수 줄임
                        .timeoutSeconds(60) // 더 긴 타임아웃
                        .build();
                    
                    AiResponse response = pythonBridge.executeScript(request);
                    
                    if (response.isSuccess()) {
                        coachingGenerationSuccessCounter.increment();
                        
                        CoachingCard card = response.getCoachingCard();
                        log.info("코칭 생성 완료 - 신뢰도: {} (correlationId: {})", 
                            card != null ? card.getConfidenceScore() : "N/A", correlationId);
                    } else {
                        coachingGenerationFailureCounter.increment();
                        log.warn("코칭 생성 실패: {} (correlationId: {})", 
                            response.getErrorMessage(), correlationId);
                    }
                    
                    return response;
                    
                } catch (AiProcessingException e) {
                    coachingGenerationFailureCounter.increment();
                    log.error("코칭 생성 예외 (correlationId: {}): {}", correlationId, e.getMessage());
                    return AiResponse.error("코칭 생성 중 오류 발생: " + e.getMessage(), e, correlationId);
                }
            }));
    }
    
    /**
     * AI 시스템 상태 체크
     */
    public boolean isAiSystemHealthy() {
        try {
            boolean healthy = pythonBridge.isHealthy();
            
            if (healthy) {
                log.debug("AI 시스템 헬스체크 성공");
            } else {
                log.warn("AI 시스템 헬스체크 실패");
            }
            
            return healthy;
            
        } catch (Exception e) {
            log.error("AI 시스템 헬스체크 예외: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * 피드백 처리 결과 검증
     */
    public boolean validateFeedbackResult(AiResponse response) {
        if (!response.isSuccess()) {
            return false;
        }
        
        List<StructuredTag> tags = response.getStructuredTags();
        if (tags == null || tags.isEmpty()) {
            log.warn("구조화된 태그가 없음 (correlationId: {})", response.getCorrelationId());
            return false;
        }
        
        // 유효하지 않은 태그 확인
        long invalidTags = tags.stream()
            .filter(tag -> !tag.isValid())
            .count();
            
        if (invalidTags > 0) {
            log.warn("유효하지 않은 태그 {}개 발견 (correlationId: {})", 
                invalidTags, response.getCorrelationId());
        }
        
        return invalidTags == 0;
    }
    
    /**
     * 코칭 카드 결과 검증
     */
    public boolean validateCoachingResult(AiResponse response) {
        if (!response.isSuccess()) {
            return false;
        }
        
        CoachingCard card = response.getCoachingCard();
        if (card == null) {
            log.warn("코칭 카드가 없음 (correlationId: {})", response.getCorrelationId());
            return false;
        }
        
        if (!card.isValid()) {
            log.warn("유효하지 않은 코칭 카드 (correlationId: {})", response.getCorrelationId());
            return false;
        }
        
        if (!card.isHighConfidence()) {
            log.warn("낮은 신뢰도 코칭 카드: {} (correlationId: {})", 
                card.getConfidenceScore(), response.getCorrelationId());
        }
        
        return true;
    }
    
    /**
     * 우아한 성능 저하 - 기본 키워드 추출
     */
    public AiResponse fallbackKeywordExtraction(String feedbackText, String correlationId) {
        log.info("대체 키워드 추출 사용 (correlationId: {})", correlationId);
        
        // 간단한 한국어 키워드 매칭
        List<StructuredTag> fallbackTags = extractBasicKeywords(feedbackText);
        
        return AiResponse.successForPipeline1(
            fallbackTags, 
            "기본 키워드 분석 결과", 
            generateCacheKey(feedbackText),
            correlationId
        );
    }
    
    /**
     * 기본 키워드 추출 로직
     */
    private List<StructuredTag> extractBasicKeywords(String text) {
        // 간단한 긍정/부정 키워드 매칭
        String[] positiveKeywords = {"좋은", "훌륭한", "뛰어난", "성실한", "꼼꼼한", "적극적", "협조적"};
        String[] negativeKeywords = {"부족한", "미흡한", "소극적", "늦은", "실수"};
        
        List<StructuredTag> tags = new java.util.ArrayList<>();
        String lowerText = text.toLowerCase();
        
        for (String keyword : positiveKeywords) {
            if (text.contains(keyword)) {
                tags.add(StructuredTag.builder()
                    .tag("#" + keyword)
                    .sentiment("Positive")
                    .confidence(0.6)
                    .category("기본분석")
                    .build());
            }
        }
        
        for (String keyword : negativeKeywords) {
            if (text.contains(keyword)) {
                tags.add(StructuredTag.builder()
                    .tag("#" + keyword)
                    .sentiment("Negative")
                    .confidence(0.6)
                    .category("기본분석")
                    .build());
            }
        }
        
        return tags.stream().limit(5).collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Correlation ID 생성
     */
    private String generateCorrelationId(String prefix) {
        return prefix + "_" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * 캐시 키 생성
     */
    private String generateCacheKey(String text) {
        return "cache_" + text.hashCode();
    }
    
    /**
     * 객체를 JSON 문자열로 변환
     */
    private String objectMapperToJson(Object obj) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = 
                new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("JSON 변환 실패: {}", e.getMessage());
            return "{}";
        }
    }
}
