import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface RightBarProps {
  isVisible: boolean;
  onToggle: () => void;
}

const RightBar: React.FC<RightBarProps> = ({ isVisible, onToggle }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        background: '#242429',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '2px solid #242429',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        justifyContent: 'flex-end', // 컨텐츠를 아래쪽으로 정렬
        padding: '0px', // 전체 패딩 추가
      }}
    >
      {/* 사이드바 토글 버튼 */}
      <Box sx={{ position: 'absolute', top: '16px', right: '16px'}}>
        <IconButton
          onClick={onToggle}
          sx={{
            padding: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          <img
            src="/sidebar.png"
            alt="Sidebar"
            style={{ 
              height: '32px', 
              width: '32px',
              transition: 'transform 0.2s ease',
              transform: isVisible ? 'rotate(0deg)' : 'rotate(180deg)'
            }}
          />
        </IconButton>
      </Box>

      {/* 메시지 입력 영역 */}
      <Box sx={{     
        width: 'full',
        mb: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#3B3B41',
        borderRadius: '24px',
        padding: '8px 16px',
        gap: '16px',
        mx: 1
      }}>
        
        <IconButton size="small" sx={{ color: '#B5B5B5', mr: -1, ml: -1}}>
          <AttachFileIcon />
        </IconButton>
        
        <TextField
          placeholder="Message HRM"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          variant="standard"
          fullWidth
          spellCheck={false}
          InputProps={{
            disableUnderline: true,
            sx: {
              color: '#FFFFFF',
              fontSize: '16px',
              '& input::placeholder': {
                color: '#8E8E93',
                opacity: 1,
              },
            },
          }}
          sx={{
            '& .MuiInput-root': {
              '&:before': { display: 'none' },
              '&:after': { display: 'none' },
            },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#323237', borderRadius: '100px' }}>
          <IconButton 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{ 
              color: '#FFFFFF',
              width: 32,
              height: 32,
              stroke: '#B5B5B5',
              '&:disabled': {
                color: '#B5B5B5',
              }
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RightBar; 