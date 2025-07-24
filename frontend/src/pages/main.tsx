import React from 'react';
import Box from '@mui/material/Box';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';
import SettingsModal from '../components/SettingsModal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { ChevronLeft } from '@mui/icons-material';
import { Card, CardContent, Chip, Grid } from '@mui/material';

// 더미 데이터
const teamMembers = [
  {
    id: 1,
    name: '김주환',
    position: 'CTO',
    role: '프론트 개발자',
    email: 'rlawnghks333@gmail.com',
    specialty: '개발세부분야',
    avatar: '/juhwan.webp',
    project: 'project3'
  },
  {
    id: 2,
    name: '허진우',
    position: 'Big Dick',
    role: '왕자',
    email: 'simonadhd@gmail.com',
    specialty: 'ahegao',
    avatar: '/jinu.png',
    project: 'project1'
  },
  {
    id: 3,
    name: '양지수',
    position: 'Designer',
    role: '디자이너',
    email: 'sujisu@gmail.com',
    specialty: 'Figma, Sketch',
    avatar: '/jisu.jpg',
    project: 'project2'
  },
  {
    id: 4,
    name: '임현성',
    position: 'Developer',
    role: '풀스택',
    email: 'star@gmail.com',
    specialty: 'React, Spring Boot',
    avatar: '/sung.jpg',
    project: 'project1'
  },
  {
    id: 5,
    name: '권민재',
    position: 'Manager',
    role: '매니저',
    email: 'runminjae@gmail.com',
    specialty: '기획, 분석',
    avatar: '/minjae.jpeg',
    project: 'project3'
  },
  {
    id: 6,
    name: '이지은',
    position: 'Cheerleader',
    role: '예쁜 여자',
    email: 'jieun.lee@gmail.com',
    specialty: 'beautiful',
    avatar: '/iu.jpeg',
    project: 'project2'
  }
];

const projects = ['All', 'project1', 'project2', 'project3'];

const Main: React.FC = () => {
  const [isRightBarVisible, setIsRightBarVisible] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRightBar = () => {
    setIsRightBarVisible(!isRightBarVisible);
  };

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  // 필터링된 팀원 리스트
  const filteredMembers = teamMembers.filter(member => {
    const matchesProject = selectedProject === 'All' || member.project === selectedProject;
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const MemberCard = ({ member }: { member: any }) => (
    <Card
      sx={{
        backgroundColor: '#242429',
        borderRadius: '10px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
          <Box
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#8B7355',
              mr: 2,
              borderRadius: '10px',
            }}
          >
            <img 
              src={member.avatar} 
              alt={member.name}
              style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '10px' }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94959C', fontSize: '14px', fontweight: 500 }}>
              {member.position} / {member.role}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#94959C', mb: 1, fontSize: '14px', fontweight: 400 }}>
          {member.email}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94959C', fontSize: '12px', fontweight: 400 }}>
            {member.specialty}
          </Typography>
          <Chip 
            label={member.project}
            size="small"
            sx={{
              backgroundColor: member.project === 'project1' ? '#7C3AED' : 
                             member.project === 'project2' ? '#EC4899' :
                             '#10B981',
              color: '#fff',
              fontSize: '11px',
              height: '24px',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', background: '#1A1A1E' }}>
      <LeftBar onOpenSettings={openSettingsModal} />
      <Box sx={{ 
        flex: 1, 
        background: '#1A1A1E',
        transition: 'margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        marginRight: isRightBarVisible ? '320px' : '0px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 헤더 */}
        <Box sx={{ zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '10%', background: '#1A1A1E', borderBottom: '1px solid #222225', px: 3 }}>
          <Typography sx={{ color: '#94959C', fontSize: 28, fontFamily: 'Inter', fontWeight: '100' }}>
            MEMBERS
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '20px', background: '#222225', width: '360px', height: '50px' }}>
              <SearchIcon sx={{ color: '#5865F2', mr: 1, ml: 2 }} />
              <TextField
                placeholder="Search for someone"
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                }}
              />
            </Box>    
            <Box sx={{ display: 'flex', mr:5, alignItems: 'center', borderRadius: '40px', background: '#222225' }}>
              <img 
                src="/iu.jpeg" 
                alt="icon" 
                style={{ 
                  width: '60px', 
                  height: '60px',  // auto에서 60px로 변경
                  objectFit: 'cover',  // 이미지 비율 유지하면서 영역을 채움
                  borderRadius: '50%', 
                  cursor: 'pointer'
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* 프로젝트 탭 */}
        <Box sx={{ px: 5 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {projects.map((project) => (
              <Chip
                key={project}
                label={project}
                clickable
                onClick={() => setSelectedProject(project)}
                sx={{
                  zIndex: 0,
                  mt: -1,
                  minWidth: '70px',
                  borderRadius: '0px 0px 10px 10px',
                  backgroundColor: selectedProject === project ? '#5865F2' : '#333',
                  color: selectedProject === project ? '#fff' : '#94959C',
                  '&:hover': {
                    transform: 'translateY(5px)',
                    transition: 'transform 0.2s ease-in-out',
                    backgroundColor: selectedProject === project ? '#4752C4' : '#333',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 메인 컨텐츠 - 카드 그리드 */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          overflowY: 'auto'
        }}>
          <Grid container spacing={2}>
            {filteredMembers.map((member) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                key={member.id}
                sx={{
                  minWidth: '280px', // 카드의 최소 너비 설정
                }}
              >
                <MemberCard member={member} />
              </Grid>
            ))}
          </Grid>
          
          {filteredMembers.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px' 
            }}>
              <Typography sx={{ color: '#94959C', fontSize: 18 }}>
                검색 결과가 없습니다.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <RightBar 
        isVisible={isRightBarVisible}
        onToggle={toggleRightBar}
      />
      
      {/* RightBar 토글 탭 */}
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
              width: '15px',
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

      <SettingsModal 
        open={isSettingsModalOpen} 
        onClose={closeSettingsModal} 
      />
    </Box>
  );
};

export default Main;
