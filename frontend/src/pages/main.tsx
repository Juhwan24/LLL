import React from 'react';
import Box from '@mui/material/Box';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';




const Main: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', background: '#1A1A1E' }}>
      <LeftBar />
      <Box sx={{ flex: 1, background: '#1A1A1E' }}>
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
          <Box sx={{ ml: 1.5,mr: 1.5, p: 1.5, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', weight: 'auto', height: 'auto' }}>
            <SettingsIcon sx={{ color: '#5865F2' }} />
          </Box>
          <Box sx={{ mr: 1.5, p: 1.5, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', weight: 'auto', height: 'auto' }}>
            <NotificationsIcon sx={{ color: '#FE5C73' }} />
          </Box>
          <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', weight: 'auto', height: 'auto' }}>
            <img src="/icon.png" alt="icon" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
          </Box>
        </Box>
        </Box>
      </Box>
      <RightBar />
    </Box>
  );
};

export default Main;
