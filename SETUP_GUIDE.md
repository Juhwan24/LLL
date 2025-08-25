# 🚀 하이브리드 AI 파이프라인 설치 및 실행 가이드

## 📋 **개요**

이 프로젝트는 Java Spring Boot + Python AI의 하이브리드 아키텍처로 구성된 HRM 시스템입니다.

### **시스템 구성**
```
LLL/
├── frontend/           # React (TypeScript) - 프론트엔드
├── backend/hrm/        # Spring Boot (Java) - 백엔드 + AI 연동
└── ai/                # Python AI 파이프라인 (새로 추가됨)
```

### **AI 기능**
- **Living Manual Engine**: 피드백 텍스트 → 구조화된 태그 변환
- **AI Leadership Coach**: MCP 기반 코칭 카드 생성

## 🛠️ **설치 방법**

### **1. 기본 요구사항**
- **Java 17+**
- **Node.js 18+**
- **Python 3.8+**
- **PostgreSQL 15+**
- **Redis** (선택사항, 캐싱용)

### **2. Python AI 환경 설정**
```bash
# 1. Python 가상환경 생성
cd LLL
python -m venv ai_env

# 2. 가상환경 활성화
# Windows:
ai_env\Scripts\activate
# macOS/Linux:
source ai_env/bin/activate

# 3. AI 의존성 설치
cd ai
pip install -r requirements.txt

# 4. 환경변수 설정
cp env_example.txt .env
# .env 파일을 편집하여 OPENAI_API_KEY 설정
```

### **3. Java 백엔드 설정**
```bash
cd backend/hrm

# Gradle 빌드
./gradlew build

# 환경변수 설정 (application.properties 또는 시스템 환경변수)
export OPENAI_API_KEY=your_openai_api_key_here
export REDIS_HOST=localhost  # Redis 사용시
export REDIS_PORT=6379
```

### **4. 프론트엔드 설정**
```bash
cd frontend
npm install
```

## 🚀 **실행 방법**

### **전체 시스템 실행**
```bash
# 1. Redis 실행 (선택사항)
redis-server

# 2. PostgreSQL 실행 및 DB 생성
psql -U postgres
CREATE DATABASE lll_db;
CREATE USER lll_user WITH PASSWORD 'lll_password';
GRANT ALL PRIVILEGES ON DATABASE lll_db TO lll_user;

# 3. Python 가상환경 활성화
source ai_env/bin/activate  # 또는 Windows: ai_env\Scripts\activate

# 4. Java 백엔드 실행
cd backend/hrm
./gradlew bootRun

# 5. React 프론트엔드 실행 (새 터미널)
cd frontend
npm start
```

### **AI 파이프라인 개별 테스트**
```bash
# Python 환경에서
cd ai

# 헬스체크
python test_scripts.py health_check

# 피드백 처리 테스트
python pipeline1_living_manual.py "동료가 매우 성실하고 꼼꼼합니다."

# 코칭 생성 테스트 (간단한 MCP 패킷)
python test_scripts.py test_pipeline2
```

## ⚙️ **환경변수 설정**

### **Java 애플리케이션 (application.properties)**
```properties
# AI 관련 필수 설정
openai.api.key=${OPENAI_API_KEY}
app.ai.python.path=python
app.ai.scripts.path=ai

# Redis 설정 (선택사항)
spring.data.redis.host=${REDIS_HOST:localhost}
spring.data.redis.port=${REDIS_PORT:6379}
```

### **Python AI (.env 파일)**
```bash
# 필수
OPENAI_API_KEY=your_openai_api_key_here

# 선택사항
OPENAI_MODEL_COST_EFFECTIVE=gpt-3.5-turbo
OPENAI_MODEL_HIGH_PERFORMANCE=gpt-4o
MAX_TEXT_LENGTH=1000
STRUCTURED_LOGGING=true
```

## 🔗 **API 엔드포인트**

### **기존 엔드포인트**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080 (또는 배포된 URL)
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### **새로운 AI 엔드포인트 (예정)**
- **POST** `/api/ai/feedback/process` - 피드백 처리
- **POST** `/api/ai/coaching/generate` - 코칭 카드 생성
- **GET** `/api/ai/health` - AI 시스템 상태 체크

## 🧪 **테스트 방법**

### **1. 시스템 헬스체크**
```bash
# Python AI 시스템 체크
cd ai
python test_scripts.py health_check

# Java 애플리케이션 체크
curl http://localhost:8080/actuator/health
```

### **2. AI 기능 테스트**
```bash
# 전체 AI 파이프라인 테스트
cd ai
python test_scripts.py test_all

# 개별 컴포넌트 테스트
python test_scripts.py test_pipeline1
python test_scripts.py test_pipeline2
```

### **3. 통합 테스트**
```bash
# Java에서 Python 호출 테스트 (Java 애플리케이션 실행 후)
curl -X POST http://localhost:8080/api/ai/health \
  -H "Content-Type: application/json"
```

## 📊 **모니터링 및 로깅**

### **메트릭 확인**
```bash
# Prometheus 메트릭 (Java 앱 실행 후)
curl http://localhost:8080/actuator/prometheus

# AI 파이프라인 메트릭 (선택사항)
# Python에서 메트릭 서버 실행시 http://localhost:8080/metrics
```

### **로그 위치**
- **Java 로그**: 콘솔 출력 + application.properties 설정에 따라
- **Python 로그**: 구조화된 JSON 형태로 stdout 출력
- **통합 로깅**: Java에서 Python 로그를 파싱하여 통합

## 🐛 **문제 해결**

### **일반적인 문제**

#### 1. Python 스크립트 실행 오류
```bash
# 오류: "python: command not found"
# 해결: Python 경로 확인 및 application.properties 수정
app.ai.python.path=/usr/bin/python3  # 실제 Python 경로
```

#### 2. OpenAI API 키 오류
```bash
# 오류: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다"
# 해결: 환경변수 설정 확인
echo $OPENAI_API_KEY  # Linux/Mac
echo %OPENAI_API_KEY%  # Windows
```

#### 3. Redis 연결 오류
```bash
# 오류: "Redis connection failed"
# 해결: Redis 실행 또는 설정 비활성화
# application.properties에서
spring.cache.type=simple  # Redis 대신 메모리 캐시 사용
```

#### 4. 포트 충돌
```bash
# 오류: "Port 8080 already in use"
# 해결: 다른 포트 사용
server.port=8081  # application.properties에 추가
```

### **로그 레벨 조정**
```properties
# 개발시 디버그 로그 활성화
logging.level.com.hrm.hrm.ai=DEBUG
logging.level.org.springframework.cache=DEBUG
```

### **성능 튜닝**
```properties
# AI 처리 타임아웃 조정
app.ai.timeout.seconds=60  # 복잡한 요청용

# 스레드 풀 크기 조정
spring.task.execution.pool.max-size=30
```

## 🔄 **업그레이드 가이드**

### **Python 의존성 업데이트**
```bash
cd ai
pip install --upgrade -r requirements.txt
```

### **Java 의존성 업데이트**
```bash
cd backend/hrm
./gradlew dependencies --refresh-dependencies
```

### **AI 모델 업그레이드**
```bash
# .env 파일에서 모델 변경
OPENAI_MODEL_HIGH_PERFORMANCE=gpt-4o-2024-05-13  # 최신 모델
```

## 🚀 **배포 가이드**

### **Docker를 사용한 배포 (예정)**
```dockerfile
# Dockerfile.ai (Python AI용)
FROM python:3.11-slim
WORKDIR /app
COPY ai/ .
RUN pip install -r requirements.txt
CMD ["python", "pipeline1_living_manual.py"]
```

### **환경별 설정**
```bash
# 개발환경
export SPRING_PROFILES_ACTIVE=dev
export LOG_LEVEL=DEBUG

# 운영환경  
export SPRING_PROFILES_ACTIVE=prod
export LOG_LEVEL=INFO
export app.ai.timeout.seconds=45
```

## 📞 **지원 및 문의**

### **일반 문의**
1. 시스템 헬스체크 먼저 실행
2. 로그 확인 (Java + Python)
3. 환경변수 설정 재확인
4. 네트워크 및 API 키 유효성 점검

### **개발 관련**
- Java 코드: `backend/hrm/src/main/java/com/hrm/hrm/ai/` 패키지
- Python 코드: `ai/` 디렉토리
- 설정 파일: `backend/hrm/src/main/resources/application.properties`

### **성능 최적화**
- Redis 캐싱 활성화
- AI 모델 선택 최적화 (비용 vs 성능)
- 비동기 처리 활용
- 배치 처리 도입 (향후)
