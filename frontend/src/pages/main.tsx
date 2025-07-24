import React from 'react';
import Box from '@mui/material/Box';
import LeftBar from '../components/LeftBar';
import RightBar from '../components/RightBar';
import SettingsModal from '../components/SettingsModal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ChevronLeft } from '@mui/icons-material';
import { Card, CardContent, Avatar, Chip, Grid } from '@mui/material';

// 더미 데이터
const teamMembers = [
  {
    id: 1,
    name: '김주환',
    position: 'CTO',
    role: '프론트 개발자',
    email: 'rlawnghks333@gmail.com',
    specialty: '개발세부분야',
    avatar: '/icon.png',
    project: 'project3'
  },
  {
    id: 2,
    name: '박민수',
    position: 'Lead Developer',
    role: '백엔드 개발자',
    email: 'minsu.park@gmail.com',
    specialty: 'Node.js, AWS',
    avatar: '/icon.png',
    project: 'project1'
  },
  {
    id: 3,
    name: '이지영',
    position: 'Designer',
    role: 'UI/UX 디자이너',
    email: 'jiyoung.lee@gmail.com',
    specialty: 'Figma, Sketch',
    avatar: '/icon.png',
    project: 'project2'
  },
  {
    id: 4,
    name: '최동욱',
    position: 'Developer',
    role: '풀스택 개발자',
    email: 'dongwook.choi@gmail.com',
    specialty: 'React, Spring Boot',
    avatar: '/icon.png',
    project: 'project1'
  },
  {
    id: 5,
    name: '한소영',
    position: 'Product Manager',
    role: '프로덕트 매니저',
    email: 'soyoung.han@gmail.com',
    specialty: '기획, 분석',
    avatar: '/icon.png',
    project: 'project3'
  },
  {
    id: 6,
    name: '정현우',
    position: 'Developer',
    role: '모바일 개발자',
    email: 'hyunwoo.jung@gmail.com',
    specialty: 'React Native, Flutter',
    avatar: '/icon.png',
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
        borderRadius: 3,
        border: '1px solid #333',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        },
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#8B7355',
              mr: 2,
            }}
          >
            <img 
              src={member.avatar} 
              alt={member.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94959C', fontSize: '14px' }}>
              {member.position} / {member.role}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: '#94959C', mb: 1.5, fontSize: '13px' }}>
          {member.email}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94959C', fontSize: '12px' }}>
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
      <LeftBar />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '10%', background: '#1A1A1E', borderBottom: '2px solid #222225', px: 3 }}>
          <Typography sx={{ color: '#94959C', fontSize: 28, fontFamily: 'Inter', fontWeight: '100' }}>
            MEMBERS
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225', width: '270px', height: '50px' }}>
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
            
            <Box 
              onClick={openSettingsModal}
              sx={{ 
                p: 1.5, 
                display: 'flex', 
                alignItems: 'center', 
                borderRadius: '40px', 
                background: '#222225', 
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(88, 101, 242, 0.1)',
                }
              }}
            >
              <SettingsIcon sx={{ color: '#5865F2' }} />
            </Box>
            
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', borderRadius: '40px', background: '#222225' }}>
              <NotificationsIcon sx={{ color: '#FE5C73' }} />
            </Box>
            
            <Box sx={{ display: 'flex', mr:5, alignItems: 'center', borderRadius: '40px', background: '#222225' }}>
              <img src="/icon.png" alt="icon" style={{ width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer'}} />
            </Box>
          </Box>
        </Box>

        {/* 프로젝트 탭 */}
        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #222225' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {projects.map((project) => (
              <Chip
                key={project}
                label={project}
                clickable
                onClick={() => setSelectedProject(project)}
                sx={{
                  backgroundColor: selectedProject === project ? '#5865F2' : '#333',
                  color: selectedProject === project ? '#fff' : '#94959C',
                  borderRadius: '20px',
                  '&:hover': {
                    backgroundColor: selectedProject === project ? '#4752C4' : '#444',
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
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
