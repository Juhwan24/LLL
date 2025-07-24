import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { sendVerificationCode, verifyCode } from '../api/auth';

interface EmailVerificationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  open,
  onClose,
  email,
  onVerified,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 모달이 열릴 때 자동으로 인증코드 전송
  useEffect(() => {
    if (open && email && !codeSent) {
      console.log('전달받은 이메일:', email); // 디버깅용
      handleSendCode();
    }
  }, [open, email, codeSent]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setVerificationCode('');
      setCodeSent(false);
      setError('');
      setSuccess('');
      setCountdown(0);
      setLoading(false);
      setVerifying(false);
    }
  }, [open]);

  // 인증코드 전송
  const handleSendCode = async () => {
    console.log('인증코드 전송 요청:', email); // 디버깅용
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await sendVerificationCode(email);
      if (response.success) {
        setCodeSent(true);
        setSuccess('인증코드가 전송되었습니다.');
        setCountdown(180); // 3분 카운트다운
      } else {
        setError(response.error || '인증코드 전송에 실패했습니다.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('인증코드를 입력해주세요.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const response = await verifyCode(email, verificationCode);
      if (response.success) {
        setSuccess('이메일 인증이 완료되었습니다!');
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setError(response.error || '인증코드가 올바르지 않습니다.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#242424',
          color: '#fff',
          borderradius: 10,
        },
      }}
    >
      <DialogContent sx={{ pt: 3}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1}}>
          {/* 이메일 표시 부분 추가 */}
          <Typography 
            variant="h6" 
            sx={{ 
              textAlign: 'center', 
              color: '#fff', 
              mb: 2, 
              fontWeight: 600 
            }}
          >
            이메일 인증
          </Typography>
          
          <Typography 
            variant="body2" 
            color="#ccc" 
            textAlign="center" 
            sx={{ mb: 2 }}
          >
            <strong style={{ color: '#FF9100' }}>{email}</strong>로 인증코드를 전송했습니다.
          </Typography>

          {!codeSent && loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#FF9100' }} />
              <Typography sx={{ ml: 2, color: '#ccc' }}>인증코드 전송 중...</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb : 2}}>
                <TextField
                  label="인증코드"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6자리 인증코드 입력"
                  fullWidth
                  InputProps={{
                    style: { backgroundColor: '#333', color: '#fff' },
                  }}
                  InputLabelProps={{
                    style: { color: '#ccc' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#FF9100' },
                      '&.Mui-focused fieldset': { borderColor: '#FF9100' },
                    },
                  }}
                />
                {countdown > 0 && (
                  <Typography variant="body2" color="#FF9100" sx={{ minWidth: '60px' }}>
                    {formatTime(countdown)}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2}}>
                <Button
                  variant="outlined"
                  onClick={handleSendCode}
                  disabled={loading || countdown > 240} // 1분 후 재전송 가능
                  sx={{
                    borderColor: '#FF9100',
                    color: '#FF9100',
                    '&:hover': { borderColor: '#F57C00', backgroundColor: 'rgba(255, 145, 0, 0.1)' },
                    '&:disabled': { borderColor: '#666', color: '#666' },
                  }}
                >
                  재전송
                </Button>
                <Button
                  variant="contained"
                  onClick={handleVerifyCode}
                  disabled={verifying || !verificationCode.trim()}
                  sx={{
                    borderRadius: '10px',
                    flex: 1,
                    backgroundColor: '#FF9100',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#F57C00' },
                    '&:disabled': { backgroundColor: '#666' },
                  }}
                >
                  {verifying ? <CircularProgress size={24} /> : '인증 확인'}
                </Button>
              </Box>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ backgroundColor: '#d32f2f', color: '#fff' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ backgroundColor: '#2e7d32', color: '#fff' }}>
              {success}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#ccc',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationModal; 