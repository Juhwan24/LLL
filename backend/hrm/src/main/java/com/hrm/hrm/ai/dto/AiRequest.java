package com.hrm.hrm.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * AI 파이프라인 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiRequest {
    
    /**
     * 실행할 Python 스크립트명
     */
    private String script;
    
    /**
     * 입력 텍스트 (피드백 텍스트 또는 MCP 패킷 JSON)
     */
    private String inputText;
    
    /**
     * 추가 컨텍스트 (JSON 형태)
     */
    private String context;
    
    /**
     * 상관관계 ID (로깅 및 추적용)
     */
    private String correlationId;
    
    /**
     * 개별 타임아웃 (초 단위, 선택사항)
     */
    private Integer timeoutSeconds;
    
    /**
     * 재시도 여부
     */
    @Builder.Default
    private boolean retryEnabled = true;
    
    /**
     * 최대 재시도 횟수
     */
    @Builder.Default
    private int maxRetries = 3;
    
    /**
     * 우선순위 (1=높음, 5=낮음)
     */
    @Builder.Default
    private int priority = 3;
}
