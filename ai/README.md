# AI 파이프라인 설치 및 실행 가이드

## 📋 **개요**

이 폴더는 HRM 시스템의 AI 기능을 담당하는 Python 파이프라인들을 포함합니다.

### **파이프라인 구성**
- **Pipeline 1**: `pipeline1_living_manual.py` - 피드백 텍스트 → 구조화된 태그 변환
- **Pipeline 2**: `pipeline2_coaching_generation.py` - MCP 기반 코칭 카드 생성

## 🛠️ **설치 방법**

### **1. Python 환경 설정**
```bash
# Python 3.8+ 필요
python --version

# 가상환경 생성 (권장)
python -m venv ai_env

# 가상환경 활성화
# Windows:
ai_env\Scripts\activate
# macOS/Linux:
source ai_env/bin/activate
```

### **2. 의존성 설치**
```bash
cd ai
pip install -r requirements.txt
```

### **3. 환경변수 설정**
```bash
# .env 파일 생성
cp env_example.txt .env

# .env 파일 편집하여 실제 값 입력
# 필수: OPENAI_API_KEY
```

## 🚀 **실행 방법**

### **Pipeline 1: 피드백 처리**
```bash
# 기본 실행
python pipeline1_living_manual.py "동료가 매우 꼼꼼하고 성실합니다."

# 컨텍스트와 함께 실행
python pipeline1_living_manual.py "좋은 팀워크를 보여줍니다." '{"project": "프로젝트A", "role": "개발자"}' "corr_123"

# 출력 예시:
{
  "success": true,
  "structured_tags": [
    {"tag": "#꼼꼼함", "sentiment": "Positive", "confidence": 0.85},
    {"tag": "#성실함", "sentiment": "Positive", "confidence": 0.90}
  ],
  "summary": "긍정적인 업무 태도와 역량을 보여주는 피드백",
  "cache_key": "abc123...",
  "processing_info": {"method": "openai", "tokens_used": 150}
}
```

### **Pipeline 2: 코칭 생성**
```bash
# MCP 패킷으로 실행
python pipeline2_coaching_generation.py '{
  "metadata": {"request_id": "req_123"},
  "input_data": {
    "user_query": "팀원이 번아웃 된 것 같아요",
    "target_context": {
      "employee_id": "Employee_A",
      "weighted_skeleton_data": {"weight": 0.4, "traits": ["자율성_중시"]},
      "weighted_muscle_data": {"weight": 0.6, "tags": [{"tag": "#업무부하", "sentiment": "Negative"}]}
    }
  }
}' "corr_456"

# 출력 예시:
{
  "success": true,
  "hypotheses": ["가설1", "가설2", "가설3"],
  "best_hypothesis": "선택된 최적 가설",
  "coaching_card": {
    "goal": "팀원의 업무 부담 완화 및 동기 부여",
    "key_questions": ["최근 가장 스트레스를 받는 업무는?", "어떤 지원이 필요한가요?"],
    "things_to_avoid": ["일방적인 업무 배정", "성급한 평가"],
    "data_summary": "업무 부하 관련 부정적 피드백 증가",
    "confidence_score": 0.78
  }
}
```

### **헬스체크 및 테스트**
```bash
# 시스템 헬스체크
python test_scripts.py health_check

# 개별 파이프라인 테스트
python test_scripts.py test_pipeline1
python test_scripts.py test_pipeline2

# 전체 테스트
python test_scripts.py test_all
```

## ⚙️ **환경변수 설정**

### **필수 환경변수**
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### **선택적 환경변수**
```bash
# AI 모델 설정
OPENAI_MODEL_COST_EFFECTIVE=gpt-3.5-turbo
OPENAI_MODEL_HIGH_PERFORMANCE=gpt-4o

# 처리 제한
MAX_TEXT_LENGTH=1000
MAX_TOKENS=500

# 신뢰도 임계값
SENTIMENT_CONFIDENCE_THRESHOLD=0.7
TAG_CONFIDENCE_THRESHOLD=0.6

# 재시도 설정
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY_SECONDS=1

# 로깅 설정
LOG_LEVEL=INFO
STRUCTURED_LOGGING=true

# 모니터링 설정
ENABLE_METRICS=true
METRICS_PORT=8080
```

## 🐛 **문제 해결**

### **일반적인 오류**

#### 1. OpenAI API 키 오류
```bash
ERROR: OPENAI_API_KEY 환경변수가 설정되지 않았습니다.
```
**해결**: `.env` 파일에 올바른 API 키 설정

#### 2. 의존성 오류
```bash
ModuleNotFoundError: No module named 'openai'
```
**해결**: `pip install -r requirements.txt` 재실행

#### 3. 타임아웃 오류
```bash
"error": "Python 스크립트 실행 타임아웃"
```
**해결**: 환경변수에서 타임아웃 시간 증가 또는 텍스트 길이 단축

### **로그 확인**
- 구조화된 로그는 JSON 형태로 stdout에 출력됩니다
- Java 애플리케이션에서 파싱하여 통합 로깅 시스템에 저장됩니다

### **성능 최적화**
- 짧은 텍스트는 Java 레벨에서 캐싱됩니다
- 동일한 피드백 텍스트는 중복 처리되지 않습니다
- 네트워크 오류 시 자동 재시도됩니다

## 🔧 **개발자 가이드**

### **새로운 파이프라인 추가**
1. 새 Python 파일 생성 (예: `pipeline3_custom.py`)
2. 기본 구조 복사 (로깅, 메트릭, 예외 처리)
3. Java `AiService`에 새 메서드 추가
4. 테스트 케이스 작성

### **커스텀 프롬프트 추가**
- `utils/prompt_templates.py` 파일 생성
- 프롬프트 템플릿 관리 및 버전 관리

### **메트릭 추가**
- `utils/metrics.py`에서 새 메트릭 정의
- Prometheus에서 수집 가능한 형태로 설계

## 📊 **모니터링**

### **Prometheus 메트릭**
- `ai_pipeline_runs_total`: 파이프라인 실행 횟수
- `ai_pipeline_duration_seconds`: 파이프라인 실행 시간
- `external_api_call_duration_seconds`: 외부 API 호출 시간

### **헬스체크 엔드포인트**
```bash
# 메트릭 서버 실행 (선택사항)
python -c "from utils.metrics import start_metrics_server; start_metrics_server()"
# http://localhost:8080/metrics 에서 메트릭 확인
```

## 🔒 **보안 고려사항**

1. **API 키 관리**: 환경변수 사용, 코드에 하드코딩 금지
2. **입력 검증**: 악의적인 프롬프트 인젝션 방지
3. **출력 검증**: AI 응답의 유해성 검사
4. **로그 필터링**: 민감한 정보 로깅 방지

## 📞 **지원**

문제가 발생하면 다음을 확인해보세요:
1. `python test_scripts.py health_check` 실행
2. 환경변수 설정 확인
3. 네트워크 연결 및 API 키 유효성 확인
4. Java 애플리케이션 로그 확인
