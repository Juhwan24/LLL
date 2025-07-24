import { loginUser } from '../api/auth';

export const handleLogin = async (email: string, password: string, navigate: any) => {
  try {
    const response = await loginUser({ email, password });
    
    alert('로그인 성공!');
    navigate('/main');
  } catch (error: any) {
    alert(error.message || '로그인에 실패했습니다.');
    console.error('로그인 오류:', error);
  }
};
