export const handleLogin = async (email: string, password: string, navigate: any) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert('로그인 성공!');
        navigate('/main');
      } else {
        alert('로그인 실패');
      }
    } catch (err) {
      alert(err);
    }
  };