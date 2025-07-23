import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface HeaderProps {
  activeSection: 'home' | 'about' | 'service';
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
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
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              PaperProps={{ sx: { backgroundColor: '#000', color: '#fff', width: 220 } }}
            >
              <List>
                {menu.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleMenuClick(item.id, item.href);
                        setDrawerOpen(false);
                      }}
                      selected={activeSection === item.id}
                      sx={{
                        color: activeSection === item.id ? '#FF9100' : '#fff',
                        borderBottom: activeSection === item.id ? '2px solid #FF9100' : 'none',
                        fontWeight: 600,
                        borderRadius: 0,
                        transition: 'color 0.2s, border-bottom 0.2s',
                      }}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
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
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
