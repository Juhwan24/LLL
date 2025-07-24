import React from 'react';
import Box from '@mui/material/Box';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';
import SettingsModal from '../components/SettingsModal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ChevronLeft } from '@mui/icons-material';

const Main: React.FC = () => {
  const [isRightBarVisible, setIsRightBarVisible] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleRightBar = () => {
    setIsRightBarVisible(!isRightBarVisible);
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', background: '#1A1A1E' }}>
      <LeftBar />
      <Box sx={{ 
        flex: 1, 
        background: '#1A1A1E',
        transition: 'margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginRight: isRightBarVisible ? '320px' : '0px', // RightBar 너비만큼 조정
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', width: '100%', height: '10%', background: '#1A1A1E',borderBottom: '2px solid #222225' }}>
          <Typography sx={{ position: 'left', ml: 3, color: '#94959C', fontSize: 28, fontFamily: 'Inter', fontWeight: '100', wordWrap: 'break-word'}}>
            MEMBERS
          </Typography>
          <Box sx={{ justifyContent: 'right', display: 'flex', alignItems: 'center', width: '100%', height: '10%', background: '#1A1A1E' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', width: '270px', height: '50px' }}>
            <SearchIcon sx={{ color: '#5865F2', mr: 1, ml: 2 }} />
            <TextField
              placeholder="Search for someone"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              spellCheck={false}
              sx={{
                
                fontSize: '15px',
                fontFamily: 'Inter',
                fontWeight: '200',
                color: '#5865F2',
                '& input::placeholder': {
                  color: '#5865F2',
                  fontWeight: '200',
                  opacity: 1,
                },
                '& .MuiInputBase-input': {
                  color: '#5865F2',
                  fontWeight: '500',
                },
                '& .MuiInput-root': {
                  '&:before': { display: 'none' },
                  '&:after': { display: 'none', },
                },
              }}

            />
          </Box>
          <Box 
            onClick={openSettingsModal}
            sx={{ 
              ml: 1.5,
              mr: 1.5, 
              p: 1.5, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: '40px', 
              background: '#222225', 
              weight: 'auto', 
              height: 'auto',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(88, 101, 242, 0.1)',
              }
            }}
          >
            <SettingsIcon sx={{ color: '#5865F2' }} />
          </Box>
          <Box sx={{ mr: 1.5, p: 1.5, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', weight: 'auto', height: 'auto' }}>
            <NotificationsIcon sx={{ color: '#FE5C73' }} />
          </Box>
          <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', weight: 'auto', height: 'auto' }}>
            <img src="/icon.png" alt="icon" style={{ width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer'}}  />
          </Box>
        </Box>
        </Box>
      </Box>
      <RightBar 
        isVisible={isRightBarVisible}
        onToggle={toggleRightBar}
      />
      
      {/* RightBar 토글 탭 - RightBar가 숨겨져 있을 때만 표시 */}
      {!isRightBarVisible && (
        <Box 
          onClick={toggleRightBar}
          sx={{ 
            position: 'absolute', 
            right: 0, 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '5px',
            height: '160px',
            flexShrink: 0,
            borderRadius: '10px 0px 0px 10px',
            background: '#FFF',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'width 0.2s ease-in-out',
            overflow: 'hidden',
            '&:hover': {
              width: '15px', // 호버 시 width 10 증가 (5px → 15px)
              '& .chevron-icon': {
                opacity: 1,
                transform: 'translateX(0px)',
              }
            }
          }}
        >
          <ChevronLeft 
            className="chevron-icon"
            sx={{
              opacity: 0,
              transform: 'translateX(10px)',
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
              fontSize: '30px',
              color: '#242429',
            }}
          />
        </Box>
      )}

      {/* 설정 모달 */}
      <SettingsModal 
        open={isSettingsModalOpen} 
        onClose={closeSettingsModal} 
      />
    </Box>
  );
};

export default Main;
