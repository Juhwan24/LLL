import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { handlePersonalRegister, handleCompanyRegister } from '../routers/register';

const Register: React.FC = () => {
  const [selected, setSelected] = useState<'company' | 'personal' | null>(null);
  const [searchCompany, setSearchCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ name: string; domain: string } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [addCompany, setAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyEmail, setNewCompanyEmail] = useState('');
  const [newCompanyOwner, setNewCompanyOwner] = useState('');

  // 예시 기업 리스트
  const companyList = [
    { name: '삼성전자', domain: 'samsung.com' },
    { name: 'LG화학', domain: 'lgchem.com' },
    { name: '카카오', domain: 'kakao.com' },
    { name: '네이버', domain: 'naver.com' },
  ];
  const filteredCompanies = companyList.filter(c => c.name.includes(searchText));

  // 기업 회원가입 입력값 상태
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');

  // 기업 선택 후 값 자동 입력
  React.useEffect(() => {
    if (selectedCompany) {
      setCompanyName(selectedCompany.name);
      setCompanyEmail(`youremail@${selectedCompany.domain}`);
      setSearchCompany(false);
    }
  }, [selectedCompany]);
  const [personalName, setPersonalName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPassword, setPersonalPassword] = useState('');

  // TextField 공통 스타일
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

  const navigate = useNavigate();

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
      {/* 왼쪽 위에 h4 Typography */}
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
        <Box sx={{ mt: -30, px: 15, py: 6, borderRadius: 5, background: '#242424', boxShadow: 'none', width: '80%', position: 'relative' }}>
          {/* 선택 UI */}
          {selected === null && !searchCompany && (
            <>
              <Typography variant="h5" sx={{ ml: -5, textAlign: 'left', fontWeight: 600, mb: 1, color: '#fff' }}>
                환영합니다!
              </Typography>
              <Typography variant="h6" sx={{ ml: -5, textAlign: 'left', fontWeight: 500, mb: 3, color: '#fff' }}>
                당신은 어떤 사용자인가요?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
                <Box
                  sx={{
                    border: '5px solid #242424',
                    ':hover': { border: '5px solid #424242' },
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: 200,
                    height: 200,
                    background: '#242424',
                  }}
                  onClick={() => setSelected('company')}
                >
                  <img src="/register_company.png" alt="기업용" style={{ borderRadius: 10, width: 160, height: 160 }} />
                  <Typography variant="h6" sx={{ mt: -3, textAlign: 'center', fontWeight: 500, color: '#fff' }}>
                    기업
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: '5px solid #242424',
                    ':hover': { border: '5px solid #424242' },
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: 200,
                    height: 200,
                    background: '#242424',
                  }}
                  onClick={() => setSelected('personal')}
                >
                  <img src="/register_personal.png" alt="개인용" style={{ borderRadius: 100, width: 133, height: 133 }} />
                  <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 500, color: '#fff' }}>
                    개인
                  </Typography>
                </Box>
              </Box>
            </>
          )}
          {/* 기업 회원가입 UI */}
          {selected === 'company' && !searchCompany && (
            <>
              {/* 뒤로가기 아이콘 */}
              <Box
                sx={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', color: '#fff' }}
                onClick={() => {
                  setSelected(null);
                  setCompanyName('');
                  setCompanyEmail('');
                  setCompanyPassword('');
                  setSelectedCompany(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="27" height="27">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </Box>
              <Typography variant="h6" sx={{ mt: -2, color: '#fff', mb: 1, fontWeight: 600 }}>기업 회원가입</Typography>
              <TextField 
                label="이름" 
                name="name"
                fullWidth 
                required 
                margin="normal" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                {...textFieldProps}
              />
              <TextField
                label="기업명"
                fullWidth
                margin="normal"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                {...textFieldProps}
              />
              <TextField
                label="사내 이메일"
                fullWidth
                margin="normal"
                value={companyEmail}
                onChange={e => setCompanyEmail(e.target.value)}
                {...textFieldProps}
              />
              <TextField
                label="비밀번호"
                type="password"
                fullWidth
                margin="normal"
                value={companyPassword}
                onChange={e => setCompanyPassword(e.target.value)}
                {...textFieldProps}
              />
              <Typography
                variant="body2"
                sx={{ mb: 2, color: '#fff', textDecoration: 'underline', cursor: 'pointer', mt: 1, textAlign: 'right' }}
                onClick={() => setSearchCompany(true)}
              >
                내 기업 찾기
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 2, mt: 2, backgroundColor: '#FF9100', '&:hover': { backgroundColor: '#FF9100' }, '&:active': { backgroundColor: '#FF9100' } }} onClick={() => handleCompanyRegister(name, companyName, companyEmail, companyPassword, navigate)}>회원가입</Button>
            </>
          )}
          {/* 기업 검색 UI */}
          {selected === 'company' && searchCompany && !addCompany && (
            <>
              <Box
                sx={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', color: '#fff' }}
                onClick={() => {
                  setSearchCompany(false);
                  setSelectedCompany(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="27" height="27">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </Box>
              <Typography variant="h6" sx={{ mt: -2, color: '#fff', mb: 1, fontWeight: 600  }}>기업 검색</Typography>
              <TextField
                label="기업명 검색"
                fullWidth
                margin="normal"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                {...textFieldProps}
              />
              <Box sx={{ mt: 2, maxHeight: 200, overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: 8,
                  backgroundColor: '#222',
                  borderRadius: 8,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#444',
                  borderRadius: 8,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#FF9100',
                },
                scrollbarColor: '#444 #222',
                scrollbarWidth: 'thin',
              }}>
                {filteredCompanies.length === 0 && (
                  <Typography sx={{ color: '#fff' }}>검색 결과가 없습니다.</Typography>
                )}
                {filteredCompanies.map((c, idx) => (
                  <Box
                    key={c.domain}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#333',
                      borderRadius: 3,
                      p: 2,
                      mb: 1,
                      cursor: 'pointer',
                      border: selectedCompany?.domain === c.domain ? '2px solid #FF9100' : '2px solid transparent',
                    }}
                    onClick={() => setSelectedCompany(c)}
                  >
                    <Typography sx={{ color: '#fff' }}>{c.name}</Typography>
                    <Typography sx={{ color: '#FF9100' }}>@{c.domain}</Typography>
                  </Box>
                ))}
              </Box>
              {/* 기업 추가 안내 */}
              <Box sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#fff', display: 'inline' }}>
                  찾으시는 기업이 없으신가요?{' '}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer', display: 'inline' }}
                  onClick={() => setAddCompany(true)}
                >
                  내 기업 추가하기
      </Typography>
              </Box>
            </>
          )}
          {/* 기업 추가 폼 */}
          {selected === 'company' && searchCompany && addCompany && (
            <>
              <Box
                sx={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', color: '#fff' }}
                onClick={() => setAddCompany(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="27" height="27">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </Box>
              <Typography variant="h6" sx={{ mt: -2, color: '#fff', mb: 1, fontWeight: 600 }}>기업 추가하기</Typography>
              <TextField
                label="기업명"
                fullWidth
                margin="normal"
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                {...textFieldProps}
              />
              <TextField
                label="기업 이메일 (@로 시작)"
                fullWidth
                margin="normal"
                value={newCompanyEmail}
                onChange={e => setNewCompanyEmail(e.target.value)}
                {...textFieldProps}
              />
              <TextField
                label="대표자명"
                fullWidth
                margin="normal"
                value={newCompanyOwner}
                onChange={e => setNewCompanyOwner(e.target.value)}
                {...textFieldProps}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#FF9100', '&:hover': { backgroundColor: '#FF9100' } }}
                  disabled={!(newCompanyName && newCompanyEmail.startsWith('@') && newCompanyOwner)}
                  onClick={() => {
                    // 실제로는 서버에 등록 로직 필요
                    setAddCompany(false);
                    setSearchCompany(false);
                    setCompanyName(newCompanyName);
                    setCompanyEmail(`youremail${newCompanyEmail}`);
                    setNewCompanyName('');
                    setNewCompanyEmail('');
                    setNewCompanyOwner('');
                  }}
                >
                  확인
        </Button>
              </Box>
            </>
          )}
          {/* 개인 회원가입 UI */}
          {selected === 'personal' && (
            <>
              {/* 뒤로가기 아이콘 */}
              <Box
                sx={{ position: 'absolute', top: 32, left: 32, cursor: 'pointer', color: '#fff' }}
                onClick={() => setSelected(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="27" height="27">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </Box>
              <Typography variant="h6" sx={{ mt: -2, color: '#fff', mb: 2, fontWeight: 600 }}>개인 회원가입</Typography>
              <TextField label="이름" name="name" value={personalName} onChange={e => setPersonalName(e.target.value)} fullWidth margin="normal" {...textFieldProps} />
              <TextField label="이메일" value={personalEmail} onChange={e => setPersonalEmail(e.target.value)} fullWidth margin="normal" {...textFieldProps} />
              <TextField label="비밀번호" type="password" value={personalPassword} onChange={e => setPersonalPassword(e.target.value)} fullWidth margin="normal" {...textFieldProps} />
              <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 2, mt: 2, backgroundColor: '#FF9100', '&:hover': { backgroundColor: '#FF9100' }, '&:active': { backgroundColor: '#FF9100' } }} onClick={() => handlePersonalRegister(personalName, personalEmail, personalPassword, navigate)}>회원가입</Button>
            </>
          )}
    </Box>
  </Container>
    </div>
);
};

export default Register; 