"""
구조화된 로깅 유틸리티
"""
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional
from config import Config

class StructuredLogger:
    """구조화된 JSON 로깅 클래스"""
    
    def __init__(self, correlation_id: Optional[str] = None):
        self.correlation_id = correlation_id or self._generate_correlation_id()
        self.start_time = time.time()
    
    def _generate_correlation_id(self) -> str:
        """상관관계 ID 생성"""
        import uuid
        return str(uuid.uuid4())[:8]
    
    def log(self, level: str, message: str, extra: Optional[Dict[str, Any]] = None):
        """구조화된 로그 출력"""
        if not Config.STRUCTURED_LOGGING:
            print(f"[{level}] {message}")
            return
            
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": level.upper(),
            "correlation_id": self.correlation_id,
            "message": message,
            "elapsed_time": round(time.time() - self.start_time, 3)
        }
        
        if extra:
            log_entry["extra"] = extra
            
        # JSON을 stdout에 출력 (Java에서 파싱)
        print(json.dumps(log_entry, ensure_ascii=False), file=sys.stdout)
        sys.stdout.flush()
    
    def info(self, message: str, extra: Optional[Dict[str, Any]] = None):
        """INFO 레벨 로그"""
        self.log("INFO", message, extra)
    
    def warn(self, message: str, extra: Optional[Dict[str, Any]] = None):
        """WARN 레벨 로그"""
        self.log("WARN", message, extra)
    
    def error(self, message: str, extra: Optional[Dict[str, Any]] = None):
        """ERROR 레벨 로그"""
        self.log("ERROR", message, extra)
    
    def debug(self, message: str, extra: Optional[Dict[str, Any]] = None):
        """DEBUG 레벨 로그"""
        if Config.LOG_LEVEL == "DEBUG":
            self.log("DEBUG", message, extra)

def create_logger(correlation_id: Optional[str] = None) -> StructuredLogger:
    """로거 팩토리 함수"""
    return StructuredLogger(correlation_id)
