"""
분류 기반 NLP 프로세서
마스터 태그 시스템을 활용한 피드백 분류 및 근거 추출
"""
import json
import time
import re
from typing import List, Dict, Any, Optional
import openai
from config import Config
from master_tags import master_tag_system, TagDefinition

class ClassificationResult:
    """분류 결과 클래스"""
    def __init__(self, keyword: str, sentiment: str, evidence: str, 
                 confidence: float, mixed_details: Optional[Dict] = None):
        self.keyword = keyword
        self.sentiment = sentiment
        self.evidence = evidence
        self.confidence = confidence
        self.mixed_details = mixed_details or {}
    
    def to_dict(self) -> Dict[str, Any]:
        result = {
            "keyword": self.keyword,
            "sentiment": self.sentiment,
            "evidence": self.evidence,
            "confidence": self.confidence
        }
        if self.mixed_details:
            result["mixed_details"] = self.mixed_details
        return result
    
    def is_valid(self) -> bool:
        """결과 유효성 검증"""
        return (
            bool(self.keyword) and 
            self.sentiment in ["Positive", "Negative", "Mixed"] and
            bool(self.evidence) and
            0.0 <= self.confidence <= 1.0
        )

class ClassificationProcessor:
    """분류 기반 피드백 처리기"""
    
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        self.max_retries = Config.MAX_RETRY_ATTEMPTS
        self.retry_delay = Config.RETRY_DELAY_SECONDS
        self.master_tags = master_tag_system
    
    def classify_feedback(self, feedback_text: str, context: Optional[Dict] = None) -> List[ClassificationResult]:
        """
        피드백 텍스트를 분류하여 마스터 태그와 근거 추출
        
        Args:
            feedback_text: 분류할 피드백 텍스트
            context: 추가 컨텍스트 정보
            
        Returns:
            분류 결과 리스트
        """
        try:
            # 1. 텍스트 전처리
            cleaned_text = self._preprocess_text(feedback_text)
            
            # 2. 잠재적 태그 사전 필터링 (성능 최적화)
            potential_tags = self.master_tags.find_potential_tags(cleaned_text)
            
            # 3. AI 분류 수행
            raw_results = self._classify_with_ai(cleaned_text, potential_tags, context)
            
            # 4. 결과 검증 및 정제
            validated_results = self._validate_and_clean_results(raw_results, cleaned_text)
            
            return validated_results
            
        except Exception as e:
            # 실패 시 기본 키워드 매칭으로 대체
            return self._fallback_classification(feedback_text)
    
    def _preprocess_text(self, text: str) -> str:
        """텍스트 전처리"""
        # 길이 제한
        if len(text) > Config.MAX_TEXT_LENGTH:
            text = text[:Config.MAX_TEXT_LENGTH] + "..."
        
        # 기본 정제
        text = text.strip()
        text = re.sub(r'\s+', ' ', text)  # 여러 공백을 하나로
        
        # 특수문자 제거 (보안상)
        text = re.sub(r'[;&|`$\(\)]', '', text)
        
        return text
    
    def _classify_with_ai(self, text: str, potential_tags: List[str], 
                         context: Optional[Dict] = None) -> List[Dict]:
        """AI를 사용한 분류 수행"""
        # 재시도 로직
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return self._single_classification_attempt(text, potential_tags, context)
                
            except openai.RateLimitError as e:
                wait_time = self.retry_delay * (2 ** attempt) * 5  # Rate limit은 더 긴 대기
                if attempt < self.max_retries - 1:
                    time.sleep(wait_time)
                last_exception = e
                
            except (openai.APITimeoutError, openai.APIConnectionError) as e:
                wait_time = self.retry_delay * (2 ** attempt)
                if attempt < self.max_retries - 1:
                    time.sleep(wait_time)
                last_exception = e
                
            except (openai.AuthenticationError, openai.PermissionDeniedError) as e:
                # 인증 오류는 재시도하지 않음
                raise e
                
            except Exception as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
        
        raise last_exception
    
    def _single_classification_attempt(self, text: str, potential_tags: List[str], 
                                     context: Optional[Dict] = None) -> List[Dict]:
        """단일 분류 시도"""
        prompt = self._build_classification_prompt(text, potential_tags, context)
        
        response = openai.chat.completions.create(
            model=Config.OPENAI_MODEL_COST_EFFECTIVE,
            messages=[
                {"role": "system", "content": self._get_classification_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            max_tokens=Config.MAX_TOKENS,
            temperature=0.2,  # 분류 작업은 일관성이 중요하므로 낮은 temperature
        )
        
        ai_response = response.choices[0].message.content
        return self._parse_classification_response(ai_response)
    
    def _build_classification_prompt(self, text: str, potential_tags: List[str], 
                                   context: Optional[Dict] = None) -> str:
        """분류용 프롬프트 생성"""
        
        # 잠재적 태그가 있으면 해당 태그들만 제시 (토큰 절약)
        if potential_tags:
            relevant_tags = []
            for tag_keyword in potential_tags:
                tag_def = self.master_tags.get_tag_by_keyword(tag_keyword)
                if tag_def:
                    relevant_tags.append(f"{tag_def.keyword}: {tag_def.definition}")
            tag_list = "\n".join(relevant_tags)
        else:
            # 잠재적 태그가 없으면 전체 마스터 태그 리스트 사용
            tag_list = self.master_tags.get_formatted_tag_list()
        
        prompt = f"""
[피드백 텍스트]
"{text}"
"""
        
        if context:
            prompt += f"\n[컨텍스트]\n{json.dumps(context, ensure_ascii=False)}"
        
        prompt += f"""

[마스터 태그 리스트]
{tag_list}

위 피드백 텍스트를 분석하여 가장 적합한 마스터 태그를 선택하고 근거를 제시하세요.

[출력 규칙]
1. 최대 3개까지만 선택 (확신이 없으면 1개라도 상관없음)
2. 반드시 마스터 태그 리스트에 있는 태그만 사용
3. evidence는 원본 텍스트에서 직접 인용
4. 복합적 감정이면 Mixed 사용하고 세부 설명 추가
5. confidence는 0.3 이상인 것만 포함

[출력 형식]
[
  {{
    "keyword": "#선택된_마스터_태그",
    "sentiment": "Positive/Negative/Mixed",
    "evidence": "근거가 되는 원본 문장",
    "confidence": 0.8,
    "mixed_details": {{"positive": "긍정 부분", "negative": "부정 부분"}}
  }}
]
"""
        return prompt
    
    def _get_classification_system_prompt(self) -> str:
        """분류용 시스템 프롬프트"""
        return """당신은 HR 전문가이자 텍스트 분석 AI입니다.

핵심 임무:
1. 주어진 피드백 텍스트를 분석하여 마스터 태그 리스트에서 가장 적합한 태그를 선택
2. 선택한 이유를 원본 텍스트에서 직접 인용하여 근거로 제시
3. 정확한 감정 분석 (긍정/부정/복합)

엄격한 규칙:
- 절대 마스터 태그 리스트에 없는 새로운 태그를 만들지 마세요
- evidence는 반드시 원본 텍스트에서 그대로 인용해야 합니다
- 확신이 없으면 선택하지 마세요 (빈 배열 반환 가능)
- 반드시 유효한 JSON 배열 형식으로만 응답하세요

분석 접근법:
1. 텍스트의 핵심 의미 파악
2. 마스터 태그와의 매칭도 검토
3. 감정의 방향성 판단
4. 구체적 근거 추출"""
    
    def _parse_classification_response(self, response: str) -> List[Dict]:
        """AI 응답 파싱"""
        try:
            # JSON 파싱 시도
            parsed = json.loads(response)
            
            # 리스트가 아니면 빈 리스트 반환
            if not isinstance(parsed, list):
                return []
            
            # 각 항목 검증 및 정제
            valid_results = []
            for item in parsed:
                if self._is_valid_classification_item(item):
                    valid_results.append(item)
            
            return valid_results
            
        except json.JSONDecodeError:
            # JSON 파싱 실패 시 정규식으로 태그 추출 시도
            return self._extract_tags_with_regex(response)
    
    def _is_valid_classification_item(self, item: Dict) -> bool:
        """분류 항목 유효성 검증"""
        required_fields = ["keyword", "sentiment", "evidence", "confidence"]
        
        # 필수 필드 확인
        for field in required_fields:
            if field not in item:
                return False
        
        # 태그가 마스터 리스트에 있는지 확인
        if not self.master_tags.is_valid_tag(item["keyword"]):
            return False
        
        # 감정 값 확인
        if item["sentiment"] not in ["Positive", "Negative", "Mixed"]:
            return False
        
        # 신뢰도 범위 확인
        try:
            confidence = float(item["confidence"])
            if not (0.3 <= confidence <= 1.0):  # 최소 0.3 이상만 허용
                return False
        except (ValueError, TypeError):
            return False
        
        return True
    
    def _extract_tags_with_regex(self, text: str) -> List[Dict]:
        """정규식을 사용한 태그 추출 (JSON 파싱 실패시 대체)"""
        # 간단한 패턴 매칭으로 태그 추출
        tag_pattern = r'#([가-힣]+)'
        found_tags = re.findall(tag_pattern, text)
        
        results = []
        for tag_name in found_tags:
            full_tag = f"#{tag_name}"
            if self.master_tags.is_valid_tag(full_tag):
                results.append({
                    "keyword": full_tag,
                    "sentiment": "Positive",  # 기본값
                    "evidence": "AI 응답 파싱 실패로 기본 처리",
                    "confidence": 0.5
                })
        
        return results
    
    def _validate_and_clean_results(self, raw_results: List[Dict], 
                                   original_text: str) -> List[ClassificationResult]:
        """결과 검증 및 정제"""
        validated_results = []
        
        for item in raw_results:
            try:
                # evidence가 원본 텍스트에 실제로 있는지 확인
                if not self._is_evidence_in_text(item["evidence"], original_text):
                    # 근거가 없으면 원본 텍스트를 그대로 사용
                    item["evidence"] = original_text[:100] + "..." if len(original_text) > 100 else original_text
                
                # ClassificationResult 객체 생성
                result = ClassificationResult(
                    keyword=item["keyword"],
                    sentiment=item["sentiment"],
                    evidence=item["evidence"],
                    confidence=float(item["confidence"]),
                    mixed_details=item.get("mixed_details", {})
                )
                
                if result.is_valid():
                    validated_results.append(result)
                    
            except Exception as e:
                # 개별 항목 처리 실패는 무시하고 계속 진행
                continue
        
        # 신뢰도 순으로 정렬하고 최대 3개까지만 반환
        validated_results.sort(key=lambda x: x.confidence, reverse=True)
        return validated_results[:3]
    
    def _is_evidence_in_text(self, evidence: str, original_text: str) -> bool:
        """근거가 원본 텍스트에 포함되어 있는지 확인"""
        # 정확한 매칭
        if evidence in original_text:
            return True
        
        # 부분 매칭 (80% 이상 일치)
        evidence_words = set(evidence.split())
        original_words = set(original_text.split())
        
        if len(evidence_words) == 0:
            return False
        
        overlap = len(evidence_words.intersection(original_words))
        similarity = overlap / len(evidence_words)
        
        return similarity >= 0.8
    
    def _fallback_classification(self, feedback_text: str) -> List[ClassificationResult]:
        """AI 실패 시 기본 키워드 매칭 기반 분류"""
        potential_tags = self.master_tags.find_potential_tags(feedback_text)
        
        results = []
        for tag_keyword in potential_tags[:2]:  # 최대 2개까지
            tag_def = self.master_tags.get_tag_by_keyword(tag_keyword)
            if tag_def:
                # 긍정/부정 키워드 매칭으로 감정 판단
                sentiment = "Positive"
                for neg_keyword in tag_def.negative_keywords:
                    if neg_keyword in feedback_text.lower():
                        sentiment = "Negative"
                        break
                
                result = ClassificationResult(
                    keyword=tag_keyword,
                    sentiment=sentiment,
                    evidence=feedback_text,
                    confidence=0.5  # 기본 분류는 낮은 신뢰도
                )
                results.append(result)
        
        return results
    
    def get_classification_statistics(self, results: List[ClassificationResult]) -> Dict[str, Any]:
        """분류 결과 통계 정보"""
        if not results:
            return {"total": 0, "avg_confidence": 0, "categories": {}}
        
        total = len(results)
        avg_confidence = sum(r.confidence for r in results) / total
        
        # 카테고리별 분포
        categories = {}
        for result in results:
            tag_def = self.master_tags.get_tag_by_keyword(result.keyword)
            if tag_def:
                category = tag_def.category.value
                categories[category] = categories.get(category, 0) + 1
        
        return {
            "total": total,
            "avg_confidence": round(avg_confidence, 3),
            "categories": categories,
            "sentiments": {
                "positive": len([r for r in results if r.sentiment == "Positive"]),
                "negative": len([r for r in results if r.sentiment == "Negative"]),
                "mixed": len([r for r in results if r.sentiment == "Mixed"])
            }
        }
