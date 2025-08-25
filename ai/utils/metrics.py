"""
Prometheus 메트릭 수집 유틸리티
"""
import time
from typing import Dict, Any
from prometheus_client import Counter, Histogram, Gauge, start_http_server
from config import Config

# 메트릭 정의
AI_PIPELINE_RUNS_TOTAL = Counter(
    'ai_pipeline_runs_total',
    'Total number of AI pipeline executions',
    ['pipeline', 'status']
)

AI_PIPELINE_DURATION_SECONDS = Histogram(
    'ai_pipeline_duration_seconds',
    'Time spent in AI pipeline execution',
    ['pipeline', 'stage']
)

EXTERNAL_API_CALL_DURATION_SECONDS = Histogram(
    'external_api_call_duration_seconds',
    'Time spent in external API calls',
    ['api_provider', 'endpoint']
)

ACTIVE_PIPELINE_PROCESSES = Gauge(
    'active_pipeline_processes',
    'Number of currently active pipeline processes',
    ['pipeline']
)

class MetricsCollector:
    """메트릭 수집 클래스"""
    
    def __init__(self, pipeline_name: str):
        self.pipeline_name = pipeline_name
        self._start_time = None
        
        if Config.ENABLE_METRICS:
            ACTIVE_PIPELINE_PROCESSES.labels(pipeline=pipeline_name).inc()
    
    def start_timing(self):
        """타이밍 시작"""
        self._start_time = time.time()
    
    def record_success(self, stage: str = "total"):
        """성공 메트릭 기록"""
        if Config.ENABLE_METRICS:
            AI_PIPELINE_RUNS_TOTAL.labels(
                pipeline=self.pipeline_name, 
                status="success"
            ).inc()
            
            if self._start_time:
                duration = time.time() - self._start_time
                AI_PIPELINE_DURATION_SECONDS.labels(
                    pipeline=self.pipeline_name,
                    stage=stage
                ).observe(duration)
    
    def record_failure(self, error_type: str = "unknown"):
        """실패 메트릭 기록"""
        if Config.ENABLE_METRICS:
            AI_PIPELINE_RUNS_TOTAL.labels(
                pipeline=self.pipeline_name,
                status=f"failure_{error_type}"
            ).inc()
    
    def record_api_call(self, provider: str, endpoint: str, duration: float):
        """외부 API 호출 메트릭 기록"""
        if Config.ENABLE_METRICS:
            EXTERNAL_API_CALL_DURATION_SECONDS.labels(
                api_provider=provider,
                endpoint=endpoint
            ).observe(duration)
    
    def __enter__(self):
        self.start_timing()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if Config.ENABLE_METRICS:
            ACTIVE_PIPELINE_PROCESSES.labels(pipeline=self.pipeline_name).dec()
        
        if exc_type is None:
            self.record_success()
        else:
            self.record_failure(exc_type.__name__)

def start_metrics_server():
    """메트릭 서버 시작"""
    if Config.ENABLE_METRICS:
        start_http_server(Config.METRICS_PORT)
        print(f"Metrics server started on port {Config.METRICS_PORT}")

def create_metrics_collector(pipeline_name: str) -> MetricsCollector:
    """메트릭 수집기 팩토리 함수"""
    return MetricsCollector(pipeline_name)
