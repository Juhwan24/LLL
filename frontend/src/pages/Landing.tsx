import React, { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const SECTION_LIST = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'service', label: 'Service' },
];

const SECTION_STYLE = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const Landing: React.FC = () => {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'service'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 100; // 헤더 높이 보정
      let currentSection = 'home';
      SECTION_LIST.forEach((section, idx) => {
        const top = sectionRefs.current[idx]?.offsetTop ?? 0;
        if (scrollY >= top) currentSection = section.id;
      });
      setActiveSection(currentSection as typeof activeSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header activeSection={activeSection} />
      <Box sx={{ minHeight: '100vh', pt: 8, background: '#000000', width: '100%', position: 'relative' }}>
        {SECTION_LIST.map((section, idx) => (
          <Box
            key={section.id}
            ref={el => (sectionRefs.current[idx] = el as HTMLDivElement | null)}
            id={section.id}
            sx={{ ...SECTION_STYLE, background: section.id === 'about' ? '#f9f9f9' : '#000000' }}
          >
            <Container>
              {section.id === 'home' && (
                <Box
                  sx={{
                    width: '100%',
                    minHeight: '100vh',
                    backgroundImage: 'url(/landing_bg1.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: '#FFFFFF' }}>
                    HRM
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 4, fontWeight: 600 }}>
                    간편한 인력 관리, AI와 함께
                  </Typography>
                </Box>
              )}
              {section.id === 'about' && (
                <>
                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FF9100' }}>
                    ABOUT US
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#444' }}>
                    씨@발 이거 뭐라 소개하노
                  </Typography>
                </>
              )}
              {section.id === 'service' && (
                <>
                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF' }}>
                    서비스 소개
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff' }}>
                    사람이 잘할 수 있는 일에 집중할 때, 조직도 더 강해진다고 믿습니다
                  </Typography>
                </>
              )}
            </Container>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Landing; 