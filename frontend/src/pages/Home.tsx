import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page">
      <h1>LLL 웹 서비스에 오신 것을 환영합니다!</h1>
      <div className="card">
        <h2>기술 스택</h2>
        <ul>
          <li>프론트엔드: TypeScript + React + Create React App</li>
          <li>백엔드: Java Spring Boot 3.x</li>
          <li>데이터베이스: PostgreSQL</li>
        </ul>
      </div>
      <div className="card">
        <h2>시작하기</h2>
        <p>위의 네비게이션을 사용하여 서비스의 다양한 기능을 탐색해보세요.</p>
      </div>
    </div>
  );
};

export default Home; 