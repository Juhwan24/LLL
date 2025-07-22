import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const dummyTeams = [
  { id: 1, name: '개발팀' },
  { id: 2, name: '디자인팀' },
  { id: 3, name: '마케팅팀' },
];

const LeftBar: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(1);

  return (
    <Box sx={{ width: 260, height: '100vh', background: '#181818', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, boxSizing: 'border-box' }}>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>
        팀 관리 대시보드
      </Typography>
      <List sx={{ width: '100%' }}>
        {dummyTeams.map((team) => (
          <ListItem key={team.id} disablePadding>
            <ListItemButton
              selected={selectedId === team.id}
              onClick={() => setSelectedId(team.id)}
              sx={{
                borderRadius: 2,
                mb: 1.5,
                background: selectedId === team.id ? '#3C76F1' : 'transparent',
                '&:hover': { background: selectedId === team.id ? '#3C76F1' : '#222' },
                transition: 'background 0.2s',
                height: 56,
                pl: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: selectedId === team.id ? '#fff' : '#333', color: selectedId === team.id ? '#3C76F1' : '#fff', fontWeight: 700 }}>
                  {team.name[0]}
                </Avatar>
              </ListItemAvatar>
              <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 18 }}>
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