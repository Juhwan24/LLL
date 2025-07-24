import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [tabValue, setTabValue] = React.useState(1); // Security 탭을 기본으로 설정
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    // 변경사항 저장 로직 (여기서는 간단히 로그만 출력)
    console.log('Settings saved:', {
      currentPassword,
      newPassword,
    });
    
    // 모달 닫기
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#242429',
          color: '#242429',
          borderRadius: 3,
          minHeight: '600px',
          maxWidth: '800px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          fontSize: '1.5rem',
          fontWeight: 600,
          borderBottom: '1px solid #333',
          pb: 2,
        }}
      >
        <SettingsIcon sx={{ color: '#fff' }} />
        <IconButton
          onClick={onClose}
          sx={{
            color: '#ccc',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: '#333', mx: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#5865F2',
              height: '3px',
            },
            '& .MuiTab-root': {
              color: '#94959C',
              fontWeight: 500,
              fontSize: '16px',
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#5865F2',
              },
            },
          }}
        >
          <Tab label="Edit Profile" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <TabPanel value={tabValue} index={0}>
          {/* Edit Profile Tab */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
              Edit Profile
            </Typography>
            {/* Profile content here */}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Security Tab */}
          <Box sx={{ px: 3, pb: 3 }}>
            <Typography variant="h6" sx={{ color: '#5865F2', mb: 4, fontSize: '18px' }}>
              Change Password
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#94959C', mb: 2, fontSize: '14px' }}>
                Current Password
              </Typography>
              <TextField
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="***********"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: '#94959C',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#5865F2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5865F2',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                    padding: '16px',
                    fontSize: '14px',
                    '&::placeholder': {
                      color: '#94959C',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ color: '#94959C', mb: 2, fontSize: '14px' }}>
                New Password
              </Typography>
              <TextField
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="***********"
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: '#94959C',
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#5865F2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#5865F2',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                    padding: '16px',
                    fontSize: '14px',
                    '&::placeholder': {
                      color: '#94959C',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', p: 3, mt: 'auto' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#5865F2',
            color: '#fff',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#4752C4',
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal; 