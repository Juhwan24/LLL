import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const Login: React.FC = () => (
  <Container maxWidth="xs" sx={{ backgroundColor: '#f9f9f9' }}>
    <Box sx={{ mt: 12, p: 4, borderRadius: 3, background: '#D9D9D9', boxShadow: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        로그인
      </Typography>
      <form>
        <TextField label="이메일" variant="outlined" fullWidth margin="normal" required />
        <TextField label="비밀번호" type="password" variant="outlined" fullWidth margin="normal" required />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          로그인
        </Button>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          아직 회원이 아니신가요? <Link to="/register">회원가입</Link>
        </Typography>
      </form>
    </Box>
  </Container>
);

export default Login; 