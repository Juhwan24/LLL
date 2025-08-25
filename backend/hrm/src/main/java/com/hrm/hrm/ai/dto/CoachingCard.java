package com.hrm.hrm.ai.dto;

import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/**
 * AI가 생성하는 최종 코칭 카드
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CoachingCard {
    
    /**
     * 코칭 목표
     */
    private String goal;
    
    /**
     * 핵심 질문 목록
     */
    private List<String> keyQuestions;
    
    /**
     * 피해야 할 사항들
     */
    private List<String> thingsToAvoid;
    
    /**
     * 데이터 요약
     */
    private String dataSummary;
    
    /**
     * 신뢰도 점수 (0.0 ~ 1.0)
     */
    private Double confidenceScore;
    
    /**
     * 추천 행동 계획
     */
    private List<String> recommendedActions;
    
    /**
     * 예상 결과
     */
    private String expectedOutcome;
    
    /**
     * 후속 조치 제안
     */
    private String followUpSuggestion;
    
    /**
     * 코칭 카드 유효성 검증
     */
    public boolean isValid() {
        return goal != null && !goal.trim().isEmpty()
            && keyQuestions != null && !keyQuestions.isEmpty()
            && thingsToAvoid != null && !thingsToAvoid.isEmpty()
            && dataSummary != null && !dataSummary.trim().isEmpty()
            && confidenceScore != null && confidenceScore >= 0.0 && confidenceScore <= 1.0;
    }
    
    /**
     * 높은 신뢰도 코칭 카드 여부
     */
    public boolean isHighConfidence() {
        return confidenceScore != null && confidenceScore >= 0.7;
    }
    
    /**
     * 실행 가능한 코칭 카드 여부 (질문과 행동이 모두 있는지 확인)
     */
    public boolean isActionable() {
        return keyQuestions != null && keyQuestions.size() >= 2
            && (recommendedActions != null && !recommendedActions.isEmpty());
    }
}
