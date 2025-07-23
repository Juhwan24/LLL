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

const RightBar: React.FC = () => {
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
    <Box sx={{ 
      width: 'auto', 
      height: '100vh', 
      background: '#242429', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-end',
      alignItems: 'center', 
      boxSizing: 'border-box',
      p: 2
    }}>
      <Box sx={{ position: 'absolute', top: '16px', right: '16px'}}>
        <img
          src="/sidebar.png"
          alt="Sidebar"
          style={{ height: '32px', width: '32px' }}
        />
      </Box>
      {/* 메시지 입력 영역 */}
      <Box sx={{ 
        width: 'full',
        mb: '4px', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#3B3B41',
        borderRadius: '24px',
        padding: '8px 16px',
        gap: '16px'
      }}>
        
        <IconButton size="small" sx={{ color: '#B5B5B5' }}>
          <AttachFileIcon />
        </IconButton>
        
                  <TextField
            placeholder="Message HRM"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
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