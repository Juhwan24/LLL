"""
AI 파이프라인 설정 관리
"""
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

class Config:
    """AI 파이프라인 통합 설정"""
    
    # OpenAI 설정
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    OPENAI_MODEL_COST_EFFECTIVE = os.getenv('OPENAI_MODEL_COST_EFFECTIVE', 'gpt-3.5-turbo')
    OPENAI_MODEL_HIGH_PERFORMANCE = os.getenv('OPENAI_MODEL_HIGH_PERFORMANCE', 'gpt-4o')
    
    # 한국어 NLP 설정
    KOREAN_NLP_ENGINE = os.getenv('KOREAN_NLP_ENGINE', 'openai')  # openai, konlpy, hybrid
    
    # 처리 제한
    MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', '1000'))
    MAX_TOKENS = int(os.getenv('MAX_TOKENS', '500'))
    
    # 신뢰도 임계값
    SENTIMENT_CONFIDENCE_THRESHOLD = float(os.getenv('SENTIMENT_CONFIDENCE_THRESHOLD', '0.7'))
    TAG_CONFIDENCE_THRESHOLD = float(os.getenv('TAG_CONFIDENCE_THRESHOLD', '0.6'))
    
    # 재시도 설정
    MAX_RETRY_ATTEMPTS = int(os.getenv('MAX_RETRY_ATTEMPTS', '3'))
    RETRY_DELAY_SECONDS = int(os.getenv('RETRY_DELAY_SECONDS', '1'))
    
    # 로깅 설정
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    STRUCTURED_LOGGING = os.getenv('STRUCTURED_LOGGING', 'true').lower() == 'true'
    
    # 모니터링 설정
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'true').lower() == 'true'
    METRICS_PORT = int(os.getenv('METRICS_PORT', '8080'))
    
    @classmethod
    def validate(cls) -> bool:
        """설정 유효성 검증"""
        if not cls.OPENAI_API_KEY:
            print("ERROR: OPENAI_API_KEY 환경변수가 설정되지 않았습니다.")
            return False
        
        if cls.MAX_TEXT_LENGTH <= 0:
            print("ERROR: MAX_TEXT_LENGTH는 0보다 커야 합니다.")
            return False
            
        return True
    
    @classmethod
    def get_runtime_info(cls) -> Dict[str, Any]:
        """런타임 설정 정보 반환 (민감한 정보 제외)"""
        return {
            "nlp_engine": cls.KOREAN_NLP_ENGINE,
            "max_text_length": cls.MAX_TEXT_LENGTH,
            "max_tokens": cls.MAX_TOKENS,
            "cost_effective_model": cls.OPENAI_MODEL_COST_EFFECTIVE,
            "high_performance_model": cls.OPENAI_MODEL_HIGH_PERFORMANCE,
            "metrics_enabled": cls.ENABLE_METRICS
        }
