import React, { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Landing: React.FC = () => {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'service'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100; // 헤더 높이 보정
      const homeTop = homeRef.current?.offsetTop ?? 0;
      const aboutTop = aboutRef.current?.offsetTop ?? 0;
      const serviceTop = serviceRef.current?.offsetTop ?? 0;

      if (scrollY >= serviceTop) setActiveSection('service');
      else if (scrollY >= aboutTop) setActiveSection('about');
      else setActiveSection('home');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header activeSection={activeSection} />
      <Box sx={{ minHeight: '100vh', pt: 8, background: '#000000', width: '100%', position: 'relative',}}>
        <Box ref={homeRef} id="home" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
              HRM
            </Typography>
            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 600 }}>
              간편한 인력 관리, AI와 함께
            </Typography>
          </Container>
        </Box>
        <Box ref={aboutRef} id="about" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
          <Container>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FF9100' }}>
              ABOUT US
            </Typography>
            <Typography variant="h6" sx={{ color: '#444' }}>
              고려대학교 세종캠퍼스, 미래를 짊어진 한남들이 만든 프로젝트
            </Typography>
          </Container>
        </Box>
        <Box ref={serviceRef} id="service" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF' }}>
              서비스 소개
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff' }}>
              허진우의 염원이 담긴, 사랑의 집합체
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Landing; 