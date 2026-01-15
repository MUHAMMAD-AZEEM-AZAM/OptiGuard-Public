import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { verifyOTP, resendOTP } from '../../services/api';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  CssBaseline,
  Avatar,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function OTPVerification() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useCustomSnackbar();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!state?.userId) {
      showError('Invalid verification attempt. Please sign up again.');
      navigate('/signup');
    }
  }, [state, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      showError('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(state.userId, otp);
      showSuccess('Email verified successfully!');
      navigate('/signin');
    } catch (error) {
      showError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      await resendOTP(state.userId);
      setCanResend(false);
      setResendTimer(20);
      showSuccess('New OTP sent successfully!');
    } catch (error) {
      showError(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify Your Email
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Please enter the verification code sent to your email
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Verification Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            autoFocus
            inputProps={{ 
              maxLength: 6,
              pattern: '[0-9]*'
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            {canResend ? (
              <Link
                component="button"
                variant="body2"
                onClick={handleResendOTP}
                sx={{ cursor: 'pointer' }}
              >
                Resend OTP
              </Link>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Resend OTP in {resendTimer} seconds
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 