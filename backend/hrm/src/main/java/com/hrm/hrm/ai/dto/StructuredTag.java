package com.hrm.hrm.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * AI 처리 결과로 생성되는 구조화된 태그
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StructuredTag {
    
    /**
     * 태그명 (예: "#꼼꼼함", "#리더십")
     */
    private String tag;
    
    /**
     * 감정 분석 결과 (Positive, Negative, Neutral)
     */
    private String sentiment;
    
    /**
     * 신뢰도 점수 (0.0 ~ 1.0)
     */
    private Double confidence;
    
    /**
     * 태그 카테고리 (업무역량, 소통능력, 성격특성 등)
     */
    private String category;
    
    /**
     * 추가 메타데이터
     */
    private String metadata;
    
    /**
     * 태그 검증
     */
    public boolean isValid() {
        return tag != null && !tag.trim().isEmpty() 
            && sentiment != null 
            && confidence != null 
            && confidence >= 0.0 && confidence <= 1.0;
    }
    
    /**
     * 높은 신뢰도 태그 여부 확인
     */
    public boolean isHighConfidence(double threshold) {
        return confidence != null && confidence >= threshold;
    }
    
    /**
     * 긍정적 태그 여부 확인
     */
    public boolean isPositive() {
        return "Positive".equalsIgnoreCase(sentiment);
    }
    
    /**
     * 부정적 태그 여부 확인
     */
    public boolean isNegative() {
        return "Negative".equalsIgnoreCase(sentiment);
    }
    
    /**
     * 중립적 태그 여부 확인
     */
    public boolean isNeutral() {
        return "Neutral".equalsIgnoreCase(sentiment);
    }
}
