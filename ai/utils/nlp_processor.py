"""
NLP 텍스트 처리 유틸리티
"""
import re
import hashlib
import time
from typing import List, Dict, Any, Optional
import openai
from config import Config

class TextProcessor:
    """텍스트 전처리 및 정규화"""
    
    @staticmethod
    def normalize_for_cache(text: str) -> str:
        """캐싱용 텍스트 정규화"""
        # 1. 공백 정규화
        normalized = re.sub(r'\s+', ' ', text.strip())
        # 2. 구두점 정규화 (한국어 특성 고려)
        normalized = re.sub(r'[,.!?…]+', '', normalized)
        # 3. 영문자는 소문자 변환
        normalized = re.sub(r'([a-zA-Z]+)', lambda m: m.group(1).lower(), normalized)
        return normalized
    
    @staticmethod
    def generate_cache_key(text: str) -> str:
        """캐시 키 생성"""
        normalized = TextProcessor.normalize_for_cache(text)
        return hashlib.md5(normalized.encode('utf-8')).hexdigest()
    
    @staticmethod
    def preprocess_text(text: str) -> str:
        """기본 텍스트 전처리"""
        if len(text) > Config.MAX_TEXT_LENGTH:
            text = text[:Config.MAX_TEXT_LENGTH] + "..."
        
        # 기본 정제
        text = text.strip()
        text = re.sub(r'\s+', ' ', text)  # 여러 공백을 하나로
        
        return text
    
    @staticmethod
    def extract_keywords_basic(text: str) -> List[str]:
        """기본 키워드 추출 (AI 대체 로직용)"""
        # 간단한 한국어 키워드 추출
        positive_keywords = ['좋은', '훌륭한', '뛰어난', '성실한', '꼼꼼한', '적극적', '협조적']
        negative_keywords = ['부족한', '미흡한', '소극적', '늦은', '실수가', '문제가']
        
        found_keywords = []
        text_lower = text.lower()
        
        for keyword in positive_keywords:
            if keyword in text:
                found_keywords.append(f"#{keyword}")
        
        for keyword in negative_keywords:
            if keyword in text:
                found_keywords.append(f"#{keyword}")
        
        return found_keywords[:5]  # 최대 5개

class OpenAIProcessor:
    """OpenAI API 기반 NLP 처리"""
    
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        self.max_retries = Config.MAX_RETRY_ATTEMPTS
        self.retry_delay = Config.RETRY_DELAY_SECONDS
    
    def process_with_retry(self, text: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """재시도 로직이 포함된 AI 처리"""
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                return self._process_single_attempt(text, context)
            
            except openai.RateLimitError as e:
                # Rate limit의 경우 더 긴 대기
                wait_time = self.retry_delay * (2 ** attempt) * 5
                if attempt < self.max_retries - 1:
                    time.sleep(wait_time)
                last_exception = e
                
            except (openai.APITimeoutError, openai.APIConnectionError) as e:
                # 네트워크 오류의 경우 exponential backoff
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
        
        # 모든 재시도 실패
        raise last_exception
    
    def _process_single_attempt(self, text: str, context: Optional[Dict] = None) -> Dict[str, Any]:
        """단일 AI 처리 시도"""
        prompt = self._build_nlp_prompt(text, context)
        
        start_time = time.time()
        
        response = openai.chat.completions.create(
            model=Config.OPENAI_MODEL_COST_EFFECTIVE,
            messages=[
                {"role": "system", "content": self._get_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            max_tokens=Config.MAX_TOKENS,
            temperature=0.3
        )
        
        api_duration = time.time() - start_time
        
        # 응답 파싱
        ai_response = response.choices[0].message.content
        parsed_result = self._parse_ai_response(ai_response)
        
        return {
            "structured_tags": parsed_result["tags"],
            "summary": parsed_result.get("summary", ""),
            "processing_info": {
                "method": "openai",
                "model": Config.OPENAI_MODEL_COST_EFFECTIVE,
                "tokens_used": response.usage.total_tokens,
                "api_duration": round(api_duration, 3)
            }
        }
    
    def _build_nlp_prompt(self, text: str, context: Optional[Dict] = None) -> str:
        """NLP 처리용 프롬프트 생성"""
        base_prompt = f"""
다음 동료 피드백 텍스트를 분석하여 구조화된 태그를 추출하세요:

피드백 텍스트: "{text}"
"""
        
        if context:
            import json
            base_prompt += f"\n컨텍스트: {json.dumps(context, ensure_ascii=False)}"
        
        base_prompt += """

다음 형식의 JSON으로 응답하세요:
{
    "tags": [
        {"tag": "#키워드", "sentiment": "Positive/Negative/Neutral", "confidence": 0.0-1.0},
        ...
    ],
    "summary": "한 줄 요약"
}

주의사항:
1. 태그는 #으로 시작하는 한국어 키워드
2. 감정은 Positive, Negative, Neutral 중 하나
3. 신뢰도는 0.0~1.0 사이의 수치
4. 최대 5개의 태그만 추출
5. 반드시 유효한 JSON 형식으로 응답
"""
        return base_prompt
    
    def _get_system_prompt(self) -> str:
        """시스템 프롬프트"""
        return """당신은 HR 전문가이자 조직심리 분석가입니다. 
동료 피드백 텍스트에서 개인의 업무 성향, 역량, 행동 특성을 정확히 파악하여 
구조화된 태그로 변환하는 것이 목표입니다.

한국어 텍스트의 맥락과 뉘앙스를 정확히 이해하고, 
객관적이고 건설적인 관점으로 분석하세요.

반드시 유효한 JSON 형식으로만 응답하세요."""
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """AI 응답 파싱"""
        import json
        
        try:
            # JSON 파싱 시도
            parsed = json.loads(response)
            
            # 신뢰도 필터링
            filtered_tags = [
                tag for tag in parsed.get("tags", [])
                if tag.get("confidence", 0) >= Config.TAG_CONFIDENCE_THRESHOLD
            ]
            
            return {
                "tags": filtered_tags,
                "summary": parsed.get("summary", "")
            }
            
        except json.JSONDecodeError:
            # JSON 파싱 실패 시 기본 키워드 추출로 대체
            return self._fallback_parse(response)
    
    def _fallback_parse(self, response: str) -> Dict[str, Any]:
        """JSON 파싱 실패 시 대체 파싱"""
        # 기본 키워드 추출 사용
        keywords = TextProcessor.extract_keywords_basic(response)
        
        tags = [
            {
                "tag": keyword,
                "sentiment": "Neutral",
                "confidence": 0.5
            }
            for keyword in keywords
        ]
        
        return {
            "tags": tags,
            "summary": "AI 응답 파싱 실패로 기본 분석 적용"
        }
