import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const RightBar: React.FC = () => {
  const [openTeams, setOpenTeams] = useState(true);
  const [openProjects, setOpenProjects] = useState(false);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 350,
        height: '100vh',
        background: '#232323',
        borderLeft: '1px solid #333',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Teams Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 0.3 }}>
        <Typography variant="subtitle1" sx={{ color: '#A8A8A8', fontWeight: 400 }}>Teams</Typography>
        <IconButton onClick={() => setOpenTeams(v => !v)} sx={{ color: '#A8A8A8' }}>
          {/* 아래로 펼침/접힘 아이콘 */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d={openTeams ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </Box>
      {openTeams && (
        <Box sx={{ px: 2, py:1 }}>
          <Typography sx={{ color: '#fff', mb: 1 }}>개발팀</Typography>
          <Typography sx={{ color: '#fff', mb: 1 }}>디자인팀</Typography>
        </Box>
      )}

      {/* Projects Section */}
      <Box sx={{ borderTop: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 0.3 }}>
        <Typography variant="subtitle1" sx={{ color: '#A8A8A8', fontWeight: 400 }}>Projects</Typography>
        <IconButton onClick={() => setOpenProjects(v => !v)} sx={{ color: '#A8A8A8' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d={openProjects ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </Box>
      {openProjects && (
        <Box sx={{ px: 2, py:1 }}>
          <Typography sx={{ color: '#fff', mb: 1 }}>프로젝트 A</Typography>
          <Typography sx={{ color: '#fff', mb: 1 }}>프로젝트 B</Typography>
        </Box>
      )}
      {/* 챗봇 메시지 영역 */}
      <Box sx={{ flex: 1, width: '100%', overflowY: 'auto', background: '#181818', borderTop: '1px solid #333' }}>
        <Box
          sx={{
            width: '100%',
            minHeight: '80vh',
            maxHeight: '80vh',
            background: '#222',
            color: '#fff',
            p: 2,
            overflowY: 'auto',
            borderRadius: 0,
            '&::-webkit-scrollbar': {
              width: 8,
              backgroundColor: '#222',
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#333',
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#3C76F1',
            },
            scrollbarColor: '#444 #181818',
            scrollbarWidth: 'thin',
          }}
        >
          {/* 여기에 챗봇 메시지들이 쭉 나열 */}
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            여기에 챗봇 메시지가 표시됩니다.
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙  
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            레전드
            <br />
            앙
            <br />
            앙
            <br />
            앙
            <br />
            기모띠
            <br />
            기모띠 기모띠 레전드 기모띠
            <br />
          </Typography>
        </Box>
      </Box>
      {/* 입력창 */}
      <Box
        sx={{
          borderTop: '1px solid #333',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%', // 추가!
          background: '#232323',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          fullWidth // 추가!
          placeholder="메시지를 입력하세요..."
          variant="outlined"
          sx={{ background: '#222', input: { color: '#fff' } }}
          InputProps={{
            endAdornment: (
              <Button
                variant="contained"
                sx={{
                  alignSelf: 'flex-end',
                  minWidth: 0,
                  width: 25,
                  height: 20,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  color: '#000000',
                  p: 0,
                  boxShadow: 'none',
                  '&:hover': { background: '#2656b6' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowUpwardIcon sx={{ width: 12, height: 12 }} />
              </Button>
            ),
          }}
        />
        
      </Box>
    </Box>
  );
};

export default RightBar; 