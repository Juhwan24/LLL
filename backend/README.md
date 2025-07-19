# LLL Backend

Spring Boot 3.x 기반의 백엔드 API 서버입니다.

## 기술 스택
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- PostgreSQL
- Gradle
- Lombok

## 개발 환경 설정

### 1. 필수 요구사항
- Java 17+
- Gradle 7.6+
- PostgreSQL 15+

### 2. PostgreSQL 설정
1. PostgreSQL을 로컬에 설치하세요
2. 데이터베이스와 사용자를 생성하세요:
```sql
CREATE DATABASE lll_db;
CREATE USER lll_user WITH PASSWORD 'lll_password';
GRANT ALL PRIVILEGES ON DATABASE lll_db TO lll_user;
```

### 3. 실행 방법
```bash
# 백엔드 디렉토리로 이동
cd backend

# Gradle 래퍼 권한 설정 (Linux/Mac)
chmod +x gradlew

# 애플리케이션 실행
./gradlew bootRun
```

### 4. API 엔드포인트
- 서버 주소: http://localhost:8080
- API 문서: http://localhost:8080/api/users

### 5. 데이터베이스 설정
- 호스트: localhost
- 포트: 5432
- 데이터베이스: lll_db
- 사용자: lll_user
- 비밀번호: lll_password

## 프로젝트 구조
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/lll/
│   │   │   ├── controller/    # REST API 컨트롤러
│   │   │   ├── service/       # 비즈니스 로직
│   │   │   ├── repository/    # 데이터 접근 계층
│   │   │   ├── entity/        # JPA 엔티티
│   │   │   └── LllApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/                  # 테스트 코드
├── build.gradle
└── README.md
``` 