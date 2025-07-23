import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const dummyTeams = [
  { id: 1, name: 'DESIGN TEAM' },
  { id: 2, name: 'DEVELOP TEAM1' },
  { id: 3, name: 'DEVELOP TEAM2' },
  { id: 4, name: 'MARKETING' },
];

const LeftBar: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);

  return (
    <Box sx={{ width: 270, height: '100vh', background: '#121214', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <Box sx={{ diplay: 'flex', alignItems: 'center' }}>
        <img 
          src="/HRM.png" 
          alt="HRM Logo" 
          style={{ height: '40px', width: 'auto', marginTop: '30px', marginBottom: '30px' }}
        />
      </Box>
      <List sx={{ width: '100%' }}>
        {dummyTeams.map((team) => (
          <ListItem key={team.id} disablePadding sx={{ position: 'relative'}}>
            {/* 선택 인디케이터 - 왼쪽 하얀색 세로선들 */}
            {selectedId === team.id && (
              <Box sx={{ 
                position: 'absolute', 
                left: 0, 
                top: '0px', 
                transform: 'translateY(0%)',
                width: '6.142px',
                height: '58px',
                flexShrink: 0,
                borderRadius: '0px 10px 10px 0px',
                background: '#FFF',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 27 26" fill="none" style={{ flexShrink: 0, marginLeft: '40px' }}>
              <g clipPath="url(#clip0_40_2222)">
                <path d="M13.1324 12.2846C14.8259 12.2846 16.2924 11.6996 17.4905 10.5454C18.6887 9.3914 19.2961 7.97941 19.2961 6.34816C19.2961 4.71748 18.6887 3.30529 17.4903 2.15092C16.292 0.997102 14.8257 0.412109 13.1324 0.412109C11.4387 0.412109 9.97269 0.997102 8.77451 2.1511C7.57633 3.30511 6.96875 4.71729 6.96875 6.34816C6.96875 7.97941 7.57633 9.39159 8.7747 10.5456C9.97308 11.6994 11.4393 12.2846 13.1324 12.2846Z" fill="white"/>
                <path d="M23.917 19.3642C23.8825 18.8839 23.8126 18.36 23.7097 17.8068C23.6058 17.2495 23.4721 16.7226 23.312 16.241C23.1466 15.7433 22.9217 15.2517 22.6437 14.7807C22.3551 14.2918 22.0162 13.8661 21.6358 13.5158C21.2381 13.1493 20.7512 12.8546 20.1882 12.6397C19.627 12.4259 19.0052 12.3176 18.34 12.3176C18.0788 12.3176 17.8262 12.4208 17.3383 12.7267C17.038 12.9154 16.6867 13.1335 16.2947 13.3747C15.9595 13.5804 15.5054 13.7732 14.9444 13.9477C14.3972 14.1182 13.8415 14.2047 13.2931 14.2047C12.7447 14.2047 12.1892 14.1182 11.6414 13.9477C11.0811 13.7734 10.6269 13.5806 10.2921 13.3749C9.90378 13.1359 9.55235 12.9178 9.24758 12.7266C8.76026 12.4206 8.50743 12.3174 8.2462 12.3174C7.58083 12.3174 6.95919 12.4259 6.39827 12.6399C5.83559 12.8544 5.34847 13.1491 4.95038 13.516C4.57025 13.8665 4.23113 14.292 3.94295 14.7807C3.66513 15.2517 3.44022 15.7431 3.27465 16.2412C3.11475 16.7228 2.98101 17.2495 2.87715 17.8068C2.77426 18.3593 2.70436 18.8834 2.6698 19.3647C2.63583 19.8364 2.61865 20.3258 2.61865 20.8202C2.61865 22.1067 3.0433 23.1483 3.88067 23.9164C4.7077 24.6744 5.80201 25.059 7.13276 25.059H19.4546C20.7854 25.059 21.8793 24.6746 22.7065 23.9164C23.5441 23.1489 23.9687 22.1071 23.9687 20.82C23.9685 20.3234 23.9512 19.8335 23.917 19.3642Z" fill="white"/>
              </g>
              </svg>
            </Box>
            )}
            <ListItemButton
              selected={selectedId === team.id}
              onClick={() => setSelectedId(team.id)}
              sx={{
                ml: 0,
                borderRadius: 0,
                mb: 1.5,
                backgroundColor: selectedId === team.id ? '#2C2C30' : 'transparent',
                height: 56,
                pl: 2,
                '&:hover': {
                  backgroundColor: selectedId === team.id ? '#2C2C30' : 'transparent',
                },
                '&.Mui-selected': {
                  backgroundColor: '#2C2C30 !important',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#2C2C30 !important',
                  color: '#FFFFFF !important',
                },
              }}
            >

              <Typography sx={{ ml: 4, color: '#94959C', fontSize: 18, fontFamily: 'Inter', fontWeight: '200', wordWrap: 'break-word'}}>
                {team.name}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeftBar; 