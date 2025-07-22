import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface HeaderProps {
  activeSection: 'home' | 'about' | 'service';
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menu = [
    { label: 'Home', id: 'home' },
    { label: 'About us', id: 'about' },
    { label: '서비스 소개', id: 'service' },
    { label: '로그인', id: 'login', href: '/login' }
  ];

  const handleMenuClick = (id: string, href?: string) => {
    if (href) {
      window.location.href = href;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? 'rgba(0,0,0,0.85)' : '#000000',
        backdropFilter: scrolled ? 'saturate(180%) blur(1px)' : undefined,
        borderBottom: scrolled ? '1.5px solid #000000' : 'none',
        boxShadow: 'none',
        transition: 'background 0.2s, border-bottom 0.2s',
        zIndex: 1201,
      }}
    >
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 800 }}>
          HRM
        </Typography>
        <Box sx={{ display: 'flex', gap: 6 }}>
          {menu.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={() => handleMenuClick(item.id, item.href)}
              sx={{
                color: activeSection === item.id ? '#FF9100' : '#fff',
                borderBottom: activeSection === item.id ? '2px solid #FF9100' : 'none',
                borderRadius: 0,
                fontWeight: 600,
                transition: 'color 0.2s, border-bottom 0.2s'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
