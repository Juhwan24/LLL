# LLL - 웹 서비스 프로젝트

## 프로젝트 개요
TypeScript 기반 프론트엔드, Java Spring 기반 백엔드, PostgreSQL 기반의 웹 서비스입니다.

## 기술 스택
- **프론트엔드**: TypeScript, React, Create React App
- **백엔드**: Java 17, Spring Boot 3.x, Spring Data JPA
- **데이터베이스**: PostgreSQL

## 프로젝트 구조
```
LLL/
├── frontend/          # TypeScript + React 프론트엔드
├── backend/           # Java Spring Boot 백엔드
└── README.md
```

## 개발 환경 설정

### 1. 필수 요구사항
- Node.js 18+ 
- Java 17+
- PostgreSQL 15+

### 2. PostgreSQL 설치 및 설정
1. PostgreSQL을 로컬에 설치하세요
2. 데이터베이스 생성:
```sql
CREATE DATABASE lll_db;
CREATE USER lll_user WITH PASSWORD 'lll_password';
GRANT ALL PRIVILEGES ON DATABASE lll_db TO lll_user;
```

### 3. 개발 서버 실행
```bash
# 백엔드 실행
cd backend && ./gradlew bootRun

# 프론트엔드 실행 (새 터미널에서)
cd frontend && npm start
```

### 4. 접속 정보
- 프론트엔드: http://localhost:3000
- 백엔드 API: https://diligent-analysis-production.up.railway.app/
- PostgreSQL: localhost:5432

## 개발 가이드
각 디렉토리의 README.md 파일을 참조하세요.
나도 contributor 나도