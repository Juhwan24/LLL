import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/users">사용자 목록</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 