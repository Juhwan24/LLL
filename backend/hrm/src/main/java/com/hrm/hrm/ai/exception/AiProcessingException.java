package com.hrm.hrm.ai.exception;

/**
 * AI 처리 과정에서 발생하는 예외
 */
public class AiProcessingException extends RuntimeException {
    
    private final String correlationId;
    private final String aiPipeline;
    private final int exitCode;
    
    public AiProcessingException(String message, String correlationId) {
        super(message);
        this.correlationId = correlationId;
        this.aiPipeline = "unknown";
        this.exitCode = -1;
    }
    
    public AiProcessingException(String message, String correlationId, String aiPipeline) {
        super(message);
        this.correlationId = correlationId;
        this.aiPipeline = aiPipeline;
        this.exitCode = -1;
    }
    
    public AiProcessingException(String message, String correlationId, String aiPipeline, int exitCode) {
        super(message);
        this.correlationId = correlationId;
        this.aiPipeline = aiPipeline;
        this.exitCode = exitCode;
    }
    
    public AiProcessingException(String message, Throwable cause, String correlationId) {
        super(message, cause);
        this.correlationId = correlationId;
        this.aiPipeline = "unknown";
        this.exitCode = -1;
    }
    
    public String getCorrelationId() {
        return correlationId;
    }
    
    public String getAiPipeline() {
        return aiPipeline;
    }
    
    public int getExitCode() {
        return exitCode;
    }
    
    /**
     * 일시적 오류 여부 판단
     */
    public boolean isTransient() {
        String message = getMessage().toLowerCase();
        return message.contains("timeout") 
            || message.contains("network") 
            || message.contains("connection")
            || message.contains("rate limit");
    }
    
    /**
     * 재시도 가능 여부 판단
     */
    public boolean isRetryable() {
        return isTransient() && exitCode != 2; // exit code 2는 영구적 실패로 간주
    }
}
