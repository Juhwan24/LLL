import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 버튼 활성화 조건: 이메일과 비밀번호가 모두 입력되었을 때
  const isButtonDisabled = !email.trim() || !password.trim();

  // 로그인 처리 함수
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await loginUser({ email, password });
      
      alert('로그인 성공!');
      navigate('/main');
    } catch (error: any) {
      alert(error.message || '로그인에 실패했습니다.');
      console.error('로그인 오류:', error);
    }
  };

  // TextField 공통 스타일 (Register와 동일)
  const textFieldProps = {
    InputProps: {
      style: {
        backgroundColor: '#222',
        color: '#fff',
      },
    },
    InputLabelProps: {
      style: {
        color: '#fff',
      },
    },
    sx: {
      input: { color: '#fff' },
      label: { color: '#fff' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#fff' },
        '&:hover fieldset': { borderColor: '#FF9100' },
        '&.Mui-focused fieldset': { borderColor: '#FF9100' },
      },
      '& .MuiInputLabel-root': { color: '#fff' },
      '& .MuiFormHelperText-root': { color: '#fff' },
      mb: 1,
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#242424',
        backgroundImage: 'url(/bg1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      {/* 왼쪽 위 HRM */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', p: 5 }}>
        <Typography
          variant="h4"
          sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          HRM
        </Typography>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <Box sx={{ px: 15, py: 6, mt: -35, borderRadius: 5, background: '#242424', boxShadow: 'none', width: '80%' }}>
          <Typography variant="h5" sx={{ textAlign: 'left', fontWeight: 600, mb: 3, color: '#fff' }}>
            로그인
          </Typography>
          <form onSubmit={e => {e.preventDefault(); handleLogin(email, password);}}>
            <TextField label="이메일" name="email" value={email} onChange={e => setEmail(e.target.value)} variant="outlined" fullWidth margin="normal" required {...textFieldProps} />
            <TextField label="비밀번호" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} variant="outlined" fullWidth margin="normal" required {...textFieldProps} />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              disabled={isButtonDisabled}
              sx={{ 
                borderRadius: 2, 
                mb: 2, 
                mt: 2, 
                backgroundColor: isButtonDisabled ? '#666' : '#FF9100', 
                '&:hover': { 
                  backgroundColor: isButtonDisabled ? '#666' : '#FF9100' 
                }, 
                '&:active': { 
                  backgroundColor: isButtonDisabled ? '#666' : '#FF9100' 
                },
                '&.Mui-disabled': {
                  backgroundColor: '#666',
                  color: '#999'
                }
              }} 
              onClick={() => !isButtonDisabled && handleLogin(email, password)}
            >
              로그인
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#fff' }}>
              아직 회원이 아니신가요? <Link to="/register" style={{ color: '#FF9100', textDecoration: 'underline' }}>회원가입</Link>
            </Typography>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login; 