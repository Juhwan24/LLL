import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('사용자 목록을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="page">로딩 중...</div>;
  }

  if (error) {
    return <div className="page">에러: {error}</div>;
  }

  return (
    <div className="page">
      <h1>사용자 목록</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <h3>{user.username}</h3>
            <p>이메일: {user.email}</p>
            <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users; 