#!/usr/bin/env python3
"""
AI 파이프라인 1: Living Manual Engine (강화 버전)
- 피드백 텍스트 → 마스터 태그 기반 분류
- 근거 추출 및 감정 분석
- 데이터 품질 검증 시스템
"""
import sys
import json
import traceback
import hashlib
from typing import Dict, Any, Optional, List
from config import Config
from utils.logger import create_logger
from utils.metrics import create_metrics_collector
from utils.classification_processor import ClassificationProcessor, ClassificationResult
from master_tags import master_tag_system

class LivingManualPipelineV2:
    """Living Manual 데이터 처리 파이프라인 (강화 버전)"""
    
    def __init__(self, correlation_id: Optional[str] = None):
        self.logger = create_logger(correlation_id)
        self.metrics = create_metrics_collector("living_manual_v2")
        self.classification_processor = ClassificationProcessor()
        self.master_tags = master_tag_system
        
        # 설정 검증
        if not Config.validate():
            raise ValueError("Configuration validation failed")
    
    def process_feedback_text(self, feedback_text: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        피드백 텍스트를 마스터 태그 기반으로 분류 및 근거 추출
        
        Args:
            feedback_text: 원본 피드백 텍스트
            context: 추가 컨텍스트 (프로젝트명, 직무 등)
            
        Returns:
            {
                "success": true/false,
                "classification_results": [
                    {
                        "keyword": "#꼼꼼함",
                        "sentiment": "Positive",
                        "evidence": "세부사항까지 놓치지 않고 체크했습니다",
                        "confidence": 0.85,
                        "category": "업무수행"
                    }
                ],
                "summary": "분류 요약",
                "statistics": {"total": 2, "avg_confidence": 0.8, "categories": {...}},
                "processing_info": {"method": "classification", "master_tags_version": "v1"},
                "cache_key": "텍스트 해시",
                "data_quality": {"validation_passed": true, "issues": []},
                "error": "오류 메시지 (실패시)"
            }
        """
        
        with self.metrics:
            try:
                self.logger.info("피드백 분류 처리 시작", {
                    "text_length": len(feedback_text),
                    "has_context": context is not None,
                    "master_tags_count": len(self.master_tags.get_tag_keywords())
                })
                
                # 1. 캐시 키 생성
                cache_key = self._generate_cache_key(feedback_text, context)
                
                # 2. 마스터 태그 기반 분류 수행
                classification_results = self.classification_processor.classify_feedback(
                    feedback_text, context
                )
                
                # 3. 결과 품질 검증
                data_quality = self._validate_data_quality(classification_results, feedback_text)
                
                # 4. 통계 정보 생성
                statistics = self.classification_processor.get_classification_statistics(classification_results)
                
                # 5. 요약 생성
                summary = self._generate_summary(classification_results, statistics)
                
                # 6. 최종 결과 구성
                result_dicts = []
                for result in classification_results:
                    result_dict = result.to_dict()
                    # 카테고리 정보 추가
                    tag_def = self.master_tags.get_tag_by_keyword(result.keyword)
                    if tag_def:
                        result_dict["category"] = tag_def.category.value
                    result_dicts.append(result_dict)
                
                final_result = {
                    "success": True,
                    "classification_results": result_dicts,
                    "summary": summary,
                    "statistics": statistics,
                    "processing_info": {
                        "method": "classification_v2",
                        "master_tags_version": "v1",
                        "total_master_tags": len(self.master_tags.get_tag_keywords()),
                        "processing_model": Config.OPENAI_MODEL_COST_EFFECTIVE
                    },
                    "cache_key": cache_key,
                    "data_quality": data_quality
                }
                
                self.logger.info("피드백 분류 처리 완료", {
                    "results_count": len(classification_results),
                    "avg_confidence": statistics.get("avg_confidence", 0),
                    "validation_passed": data_quality["validation_passed"]
                })
                
                return final_result
                
            except Exception as e:
                error_message = str(e)
                self.logger.error("피드백 분류 처리 실패", {
                    "error": error_message,
                    "error_type": type(e).__name__,
                    "traceback": traceback.format_exc()
                })
                
                return {
                    "success": False,
                    "classification_results": [],
                    "summary": "",
                    "statistics": {"total": 0, "avg_confidence": 0, "categories": {}},
                    "processing_info": {"method": "error", "error_type": type(e).__name__},
                    "cache_key": "",
                    "data_quality": {"validation_passed": False, "issues": ["Processing failed"]},
                    "error": error_message
                }
    
    def _generate_cache_key(self, feedback_text: str, context: Optional[Dict] = None) -> str:
        """캐시 키 생성"""
        content = feedback_text
        if context:
            content += json.dumps(context, sort_keys=True, ensure_ascii=False)
        
        return hashlib.sha256(content.encode('utf-8')).hexdigest()[:16]
    
    def _validate_data_quality(self, results: List[ClassificationResult], 
                              original_text: str) -> Dict[str, Any]:
        """데이터 품질 검증"""
        issues = []
        
        # 1. 결과 개수 검증
        if len(results) == 0:
            issues.append("No classification results")
        elif len(results) > 3:
            issues.append("Too many results (>3)")
        
        # 2. 신뢰도 검증
        low_confidence_count = len([r for r in results if r.confidence < 0.5])
        if low_confidence_count > 0:
            issues.append(f"{low_confidence_count} results with low confidence")
        
        # 3. 근거 검증
        for result in results:
            if len(result.evidence) < 10:
                issues.append(f"Short evidence for {result.keyword}")
            
            # 근거가 원본 텍스트에 포함되어 있는지 확인
            if not any(word in original_text for word in result.evidence.split()):
                issues.append(f"Evidence not found in original text for {result.keyword}")
        
        # 4. 태그 중복 검증
        keywords = [r.keyword for r in results]
        if len(keywords) != len(set(keywords)):
            issues.append("Duplicate tags found")
        
        return {
            "validation_passed": len(issues) == 0,
            "issues": issues,
            "quality_score": max(0, 1.0 - (len(issues) * 0.2))  # 이슈당 0.2점 감점
        }
    
    def _generate_summary(self, results: List[ClassificationResult], 
                         statistics: Dict[str, Any]) -> str:
        """분류 결과 요약 생성"""
        if not results:
            return "분류된 태그가 없습니다."
        
        total = statistics["total"]
        avg_conf = statistics["avg_confidence"]
        
        # 주요 카테고리 파악
        categories = statistics.get("categories", {})
        main_category = max(categories.keys(), key=categories.get) if categories else "일반"
        
        # 감정 분포 파악
        sentiments = statistics.get("sentiments", {})
        if sentiments["positive"] > sentiments["negative"]:
            sentiment_trend = "긍정적"
        elif sentiments["negative"] > sentiments["positive"]:
            sentiment_trend = "부정적"
        else:
            sentiment_trend = "중립적"
        
        # 상위 태그들
        top_tags = [r.keyword for r in sorted(results, key=lambda x: x.confidence, reverse=True)[:2]]
        
        return f"{main_category} 영역에서 {total}개 태그 분류됨. {sentiment_trend} 피드백 (평균 신뢰도: {avg_conf:.2f}). 주요 태그: {', '.join(top_tags)}"

def main():
    """커맨드라인에서 호출될 때 실행"""
    try:
        if len(sys.argv) < 2:
            result = {
                "success": False,
                "error": "feedback_text argument required",
                "usage": "python pipeline1_living_manual.py <feedback_text> [context_json] [correlation_id]",
                "example": "python pipeline1_living_manual.py '동료가 매우 꼼꼼하고 성실합니다.' '{\"project\": \"A프로젝트\"}' 'corr_123'"
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        feedback_text = sys.argv[1]
        context = json.loads(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] != "null" else None
        correlation_id = sys.argv[3] if len(sys.argv) > 3 else None
        
        # 파이프라인 실행 (강화 버전)
        pipeline = LivingManualPipelineV2(correlation_id)
        result = pipeline.process_feedback_text(feedback_text, context)
        
        # 결과 출력 (Java에서 파싱)
        print(json.dumps(result, ensure_ascii=False))
        
        # 성공 여부에 따른 exit code 설정
        sys.exit(0 if result["success"] else 1)
        
    except Exception as e:
        # 최상위 예외 처리
        error_result = {
            "success": False,
            "error": f"Pipeline execution failed: {str(e)}",
            "error_type": type(e).__name__,
            "classification_results": [],
            "summary": "",
            "statistics": {"total": 0, "avg_confidence": 0, "categories": {}},
            "processing_info": {"method": "error"},
            "data_quality": {"validation_passed": False, "issues": ["Top-level exception"]}
        }
        
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
