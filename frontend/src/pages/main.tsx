import React from 'react';
import Box from '@mui/material/Box';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';

const Main: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', background: '#1A1A1E' }}>
      <LeftBar />
      <Box sx={{ flex: 1, background: '#1A1A1E' }}>
        {/* 여기에 메인 컨텐츠가 들어갈 수 있습니다 */}
      </Box>
      <RightBar />
    </Box>
  );
};

export default Main;
