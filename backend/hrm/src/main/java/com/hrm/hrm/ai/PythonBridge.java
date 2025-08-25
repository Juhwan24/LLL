package com.hrm.hrm.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrm.hrm.ai.dto.AiRequest;
import com.hrm.hrm.ai.dto.AiResponse;
import com.hrm.hrm.ai.exception.AiProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/**
 * Python AI 스크립트와의 브리지 클래스
 * 프로세스 실행, 결과 파싱, 에러 핸들링을 담당
 */
@Slf4j
@Component
public class PythonBridge {
    
    @Value("${app.ai.python.path:python}")
    private String pythonPath;
    
    @Value("${app.ai.scripts.path:ai}")
    private String scriptsPath;
    
    @Value("${app.ai.timeout.seconds:30}")
    private int defaultTimeoutSeconds;
    
    @Value("${app.ai.max.retries:3}")
    private int defaultMaxRetries;
    
    @Value("${app.ai.retry.delay.ms:1000}")
    private long retryDelayMs;
    
    private final ObjectMapper objectMapper;
    
    public PythonBridge(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    /**
     * Python 스크립트 실행 (재시도 로직 포함)
     */
    public AiResponse executeScript(AiRequest request) throws AiProcessingException {
        int maxRetries = request.isRetryEnabled() ? request.getMaxRetries() : 1;
        AiProcessingException lastException = null;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                log.debug("AI 스크립트 실행 시도 {}/{}: {} (correlationId: {})", 
                    attempt, maxRetries, request.getScript(), request.getCorrelationId());
                
                return executeScriptSingleAttempt(request);
                
            } catch (AiProcessingException e) {
                lastException = e;
                
                if (!e.isRetryable() || attempt == maxRetries) {
                    log.error("AI 스크립트 실행 최종 실패: {} (correlationId: {})", 
                        e.getMessage(), request.getCorrelationId());
                    throw e;
                }
                
                // 재시도 전 대기
                long delay = retryDelayMs * attempt; // 선형 백오프
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new AiProcessingException("재시도 중 인터럽트 발생", request.getCorrelationId());
                }
                
                log.warn("AI 스크립트 실행 실패, {}ms 후 재시도 {}/{}: {} (correlationId: {})", 
                    delay, attempt, maxRetries, e.getMessage(), request.getCorrelationId());
            }
        }
        
        throw lastException;
    }
    
    /**
     * Python 스크립트 단일 실행 시도
     */
    private AiResponse executeScriptSingleAttempt(AiRequest request) throws AiProcessingException {
        long startTime = System.currentTimeMillis();
        String correlationId = request.getCorrelationId();
        
        try {
            // 1. 프로세스 명령어 구성
            List<String> command = buildCommand(request);
            
            // 2. ProcessBuilder 생성 및 설정
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.directory(new File(scriptsPath));
            
            // 환경 변수 설정
            Map<String, String> env = processBuilder.environment();
            env.put("PYTHONPATH", scriptsPath);
            env.put("PYTHONIOENCODING", "utf-8");
            
            log.debug("Python 프로세스 시작: {} (correlationId: {})", 
                String.join(" ", command), correlationId);
            
            // 3. 프로세스 실행
            Process process = processBuilder.start();
            
            // 4. 타임아웃과 함께 대기
            int timeoutSeconds = request.getTimeoutSeconds() != null ? 
                request.getTimeoutSeconds() : defaultTimeoutSeconds;
                
            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            
            if (!finished) {
                process.destroyForcibly();
                throw new AiProcessingException(
                    String.format("Python 스크립트 실행 타임아웃 (%d초)", timeoutSeconds),
                    correlationId, request.getScript()
                );
            }
            
            // 5. 결과 읽기
            String output = readProcessOutput(process.getInputStream());
            String error = readProcessOutput(process.getErrorStream());
            int exitCode = process.exitValue();
            
            long processingTime = System.currentTimeMillis() - startTime;
            
            log.debug("Python 프로세스 완료: exitCode={}, 처리시간={}ms (correlationId: {})", 
                exitCode, processingTime, correlationId);
            
            // 6. 프로세스 종료 코드 확인
            if (exitCode != 0) {
                throw new AiProcessingException(
                    String.format("Python 스크립트 실행 실패 (exitCode=%d): %s", exitCode, error),
                    correlationId, request.getScript(), exitCode
                );
            }
            
            // 7. JSON 응답 파싱
            return parseAiResponse(output, processingTime, correlationId);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AiProcessingException("프로세스 실행 중 인터럽트 발생", e, correlationId);
            
        } catch (IOException e) {
            throw new AiProcessingException("프로세스 I/O 오류: " + e.getMessage(), e, correlationId);
            
        } catch (Exception e) {
            if (e instanceof AiProcessingException) {
                throw e;
            }
            throw new AiProcessingException("예상치 못한 오류: " + e.getMessage(), e, correlationId);
        }
    }
    
    /**
     * 프로세스 명령어 구성
     */
    private List<String> buildCommand(AiRequest request) {
        List<String> command = new ArrayList<>();
        command.add(pythonPath);
        command.add(request.getScript());
        command.add(request.getInputText());
        
        if (request.getContext() != null) {
            command.add(request.getContext());
        } else {
            command.add("null");
        }
        
        if (request.getCorrelationId() != null) {
            command.add(request.getCorrelationId());
        }
        
        return command;
    }
    
    /**
     * 프로세스 출력 읽기
     */
    private String readProcessOutput(InputStream inputStream) throws IOException {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(inputStream, "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }
        return output.toString().trim();
    }
    
    /**
     * AI 응답 파싱
     */
    private AiResponse parseAiResponse(String output, long processingTime, String correlationId) 
            throws AiProcessingException {
        try {
            if (output == null || output.trim().isEmpty()) {
                throw new AiProcessingException("Python 스크립트가 빈 응답을 반환했습니다", correlationId);
            }
            
            // JSON 파싱 시도
            Map<String, Object> rawResponse = objectMapper.readValue(output, Map.class);
            
            // AiResponse 객체 구성
            AiResponse.AiResponseBuilder builder = AiResponse.builder()
                .success((Boolean) rawResponse.getOrDefault("success", false))
                .summary((String) rawResponse.get("summary"))
                .cacheKey((String) rawResponse.get("cache_key"))
                .errorMessage((String) rawResponse.get("error"))
                .errorType((String) rawResponse.get("error_type"))
                .processingTimeMs(processingTime)
                .correlationId(correlationId)
                .rawOutput(output);
            
            // 분류 결과 파싱 (파이프라인 1 강화 결과)
            if (rawResponse.containsKey("classification_results")) {
                List<com.hrm.hrm.ai.dto.ClassificationResult> classificationResults = 
                    parseClassificationResults(rawResponse.get("classification_results"));
                builder.classificationResults(classificationResults);
                
                // 하위 호환성을 위해 StructuredTag도 생성
                List<com.hrm.hrm.ai.dto.StructuredTag> structuredTags = 
                    classificationResults.stream()
                        .map(com.hrm.hrm.ai.dto.ClassificationResult::toStructuredTag)
                        .collect(java.util.stream.Collectors.toList());
                builder.structuredTags(structuredTags);
            }
            
            // 기존 방식 지원 (하위 호환성)
            if (rawResponse.containsKey("structured_tags")) {
                builder.structuredTags(parseStructuredTags(rawResponse.get("structured_tags")));
            }
            
            // 통계 정보 파싱
            if (rawResponse.containsKey("statistics")) {
                builder.statistics((Map<String, Object>) rawResponse.get("statistics"));
            }
            
            // 데이터 품질 정보 파싱
            if (rawResponse.containsKey("data_quality")) {
                builder.dataQuality((Map<String, Object>) rawResponse.get("data_quality"));
            }
            
            // 가설 및 코칭 카드 파싱 (파이프라인 2 결과)
            if (rawResponse.containsKey("hypotheses")) {
                builder.hypotheses((List<String>) rawResponse.get("hypotheses"));
            }
            
            if (rawResponse.containsKey("best_hypothesis")) {
                builder.bestHypothesis((String) rawResponse.get("best_hypothesis"));
            }
            
            if (rawResponse.containsKey("coaching_card")) {
                builder.coachingCard(parseCoachingCard(rawResponse.get("coaching_card")));
            }
            
            // 처리 정보
            if (rawResponse.containsKey("processing_info")) {
                builder.processingInfo((Map<String, Object>) rawResponse.get("processing_info"));
            }
            
            return builder.build();
            
        } catch (Exception e) {
            log.error("AI 응답 파싱 실패 (correlationId: {}): {}", correlationId, e.getMessage());
            
            // 파싱 실패 시 raw 텍스트 응답 반환
            return AiResponse.builder()
                .success(false)
                .errorMessage("AI 응답 파싱 실패: " + e.getMessage())
                .rawOutput(output)
                .processingTimeMs(processingTime)
                .correlationId(correlationId)
                .build();
        }
    }
    
    /**
     * 분류 결과 리스트 파싱 (강화 버전)
     */
    private List<com.hrm.hrm.ai.dto.ClassificationResult> parseClassificationResults(Object resultsObj) {
        try {
            if (resultsObj instanceof List) {
                List<?> resultsList = (List<?>) resultsObj;
                List<com.hrm.hrm.ai.dto.ClassificationResult> results = new ArrayList<>();
                
                for (Object resultObj : resultsList) {
                    if (resultObj instanceof Map) {
                        Map<?, ?> resultMap = (Map<?, ?>) resultObj;
                        com.hrm.hrm.ai.dto.ClassificationResult result = com.hrm.hrm.ai.dto.ClassificationResult.builder()
                            .keyword((String) resultMap.get("keyword"))
                            .sentiment((String) resultMap.get("sentiment"))
                            .evidence((String) resultMap.get("evidence"))
                            .confidence(((Number) resultMap.getOrDefault("confidence", 0.0)).doubleValue())
                            .category((String) resultMap.get("category"))
                            .mixedDetails((Map<String, String>) resultMap.get("mixed_details"))
                            .definition((String) resultMap.get("definition"))
                            .metadata((Map<String, Object>) resultMap.get("metadata"))
                            .build();
                        
                        if (result.isValid()) {
                            results.add(result);
                        }
                    }
                }
                
                return results;
            }
        } catch (Exception e) {
            log.warn("분류 결과 파싱 실패: {}", e.getMessage());
        }
        
        return new ArrayList<>();
    }
    
    /**
     * 구조화된 태그 리스트 파싱 (하위 호환성)
     */
    @Deprecated
    private List<com.hrm.hrm.ai.dto.StructuredTag> parseStructuredTags(Object tagsObj) {
        try {
            if (tagsObj instanceof List) {
                List<?> tagsList = (List<?>) tagsObj;
                List<com.hrm.hrm.ai.dto.StructuredTag> result = new ArrayList<>();
                
                for (Object tagObj : tagsList) {
                    if (tagObj instanceof Map) {
                        Map<?, ?> tagMap = (Map<?, ?>) tagObj;
                        com.hrm.hrm.ai.dto.StructuredTag tag = com.hrm.hrm.ai.dto.StructuredTag.builder()
                            .tag((String) tagMap.get("tag"))
                            .sentiment((String) tagMap.get("sentiment"))
                            .confidence(((Number) tagMap.getOrDefault("confidence", 0.0)).doubleValue())
                            .category((String) tagMap.get("category"))
                            .metadata((String) tagMap.get("metadata"))
                            .build();
                        
                        if (tag.isValid()) {
                            result.add(tag);
                        }
                    }
                }
                
                return result;
            }
        } catch (Exception e) {
            log.warn("구조화된 태그 파싱 실패: {}", e.getMessage());
        }
        
        return new ArrayList<>();
    }
    
    /**
     * 코칭 카드 파싱
     */
    private com.hrm.hrm.ai.dto.CoachingCard parseCoachingCard(Object cardObj) {
        try {
            if (cardObj instanceof Map) {
                Map<?, ?> cardMap = (Map<?, ?>) cardObj;
                return com.hrm.hrm.ai.dto.CoachingCard.builder()
                    .goal((String) cardMap.get("goal"))
                    .keyQuestions((List<String>) cardMap.get("key_questions"))
                    .thingsToAvoid((List<String>) cardMap.get("things_to_avoid"))
                    .dataSummary((String) cardMap.get("data_summary"))
                    .confidenceScore(((Number) cardMap.getOrDefault("confidence_score", 0.0)).doubleValue())
                    .recommendedActions((List<String>) cardMap.get("recommended_actions"))
                    .expectedOutcome((String) cardMap.get("expected_outcome"))
                    .followUpSuggestion((String) cardMap.get("follow_up_suggestion"))
                    .build();
            }
        } catch (Exception e) {
            log.warn("코칭 카드 파싱 실패: {}", e.getMessage());
        }
        
        return null;
    }
    
    /**
     * 시스템 상태 체크
     */
    public boolean isHealthy() {
        try {
            AiRequest healthCheck = AiRequest.builder()
                .script("test_scripts.py")
                .inputText("health_check")
                .correlationId("health_check_" + System.currentTimeMillis())
                .timeoutSeconds(10)
                .retryEnabled(false)
                .build();
            
            AiResponse response = executeScript(healthCheck);
            return response.isSuccess();
            
        } catch (Exception e) {
            log.warn("AI 시스템 헬스체크 실패: {}", e.getMessage());
            return false;
        }
    }
}
