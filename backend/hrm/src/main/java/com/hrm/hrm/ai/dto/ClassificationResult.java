package com.hrm.hrm.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

/**
 * AI 분류 결과 DTO (강화 버전)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClassificationResult {
    
    /**
     * 마스터 태그 키워드 (예: "#꼼꼼함")
     */
    private String keyword;
    
    /**
     * 감정 분석 결과 (Positive, Negative, Mixed)
     */
    private String sentiment;
    
    /**
     * 근거 문장 (원본 텍스트에서 추출)
     */
    private String evidence;
    
    /**
     * 신뢰도 점수 (0.0 ~ 1.0)
     */
    private Double confidence;
    
    /**
     * 태그 카테고리 (업무수행, 대인관계, 개인성향, 리더십)
     */
    private String category;
    
    /**
     * 복합 감정 세부 정보 (Mixed인 경우)
     */
    private Map<String, String> mixedDetails;
    
    /**
     * 태그 정의 (참고용)
     */
    private String definition;
    
    /**
     * 추가 메타데이터
     */
    private Map<String, Object> metadata;
    
    /**
     * 결과 유효성 검증
     */
    public boolean isValid() {
        return keyword != null && !keyword.trim().isEmpty()
            && sentiment != null && ("Positive".equals(sentiment) || "Negative".equals(sentiment) || "Mixed".equals(sentiment))
            && evidence != null && !evidence.trim().isEmpty()
            && confidence != null && confidence >= 0.0 && confidence <= 1.0;
    }
    
    /**
     * 높은 신뢰도 여부 확인
     */
    public boolean isHighConfidence() {
        return confidence != null && confidence >= 0.7;
    }
    
    /**
     * 긍정적 결과 여부
     */
    public boolean isPositive() {
        return "Positive".equals(sentiment);
    }
    
    /**
     * 부정적 결과 여부
     */
    public boolean isNegative() {
        return "Negative".equals(sentiment);
    }
    
    /**
     * 복합 감정 여부
     */
    public boolean isMixed() {
        return "Mixed".equals(sentiment);
    }
    
    /**
     * 하위 호환성을 위해 StructuredTag로 변환
     */
    public StructuredTag toStructuredTag() {
        return StructuredTag.builder()
            .tag(keyword)
            .sentiment(sentiment)
            .confidence(confidence)
            .category(category)
            .metadata(evidence) // evidence를 metadata로 저장
            .build();
    }
}
