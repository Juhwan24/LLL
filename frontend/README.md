# LLL Frontend

TypeScript + React + Create React App 기반의 프론트엔드 애플리케이션입니다.

## 기술 스택
- TypeScript 4.9.5
- React 18.2.0
- Create React App 5.0.1
- React Router DOM 6.20.1
- Axios 1.6.2

## 개발 환경 설정

### 1. 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 2. 설치 및 실행

#### 의존성 설치
```bash
cd frontend
npm install
```

#### 개발 서버 실행
```bash
npm start
```

#### 빌드
```bash
npm run build
```

#### 테스트
```bash
npm test
```

### 3. 접속 정보
- 개발 서버: http://localhost:3000
- API 프록시: /api -> http://localhost:8080

## 프로젝트 구조
```
frontend/
├── public/             # 정적 파일
│   └── index.html
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── App.tsx        # 메인 앱 컴포넌트
│   ├── index.tsx      # 애플리케이션 진입점
│   ├── App.css        # 앱 스타일
│   └── index.css      # 전역 스타일
├── package.json
├── tsconfig.json
└── README.md
```

## 주요 기능
- 사용자 목록 조회
- 반응형 디자인
- API 연동 (백엔드와 통신)
- 라우팅 (React Router)

## 개발 가이드
1. 컴포넌트는 `src/components/` 디렉토리에 생성
2. 페이지는 `src/pages/` 디렉토리에 생성
3. API 호출은 Axios를 사용하여 `/api` 경로로 프록시
4. TypeScript 타입 정의를 적극 활용 