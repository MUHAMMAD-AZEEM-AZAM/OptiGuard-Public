import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { resetPassword } from '../../services/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import SitemarkIcon from '../SitemarkIcon';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useCustomSnackbar();

  const validateInputs = (password, confirmPassword) => {
    let isValid = true;

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!validateInputs(password, confirmPassword)) {
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      showSuccess('Password reset successful!');
      navigate('/signin');
    } catch (error) {
      showError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Card variant="outlined">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <SitemarkIcon width={100} />
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ 
            width: '100%', 
            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
            mb: 2 
          }}
        >
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please enter your new password below.
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="password">New Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              type="password"
              id="password"
              placeholder="••••••"
              autoComplete="new-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            <TextField
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="••••••"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={confirmPasswordError ? 'error' : 'primary'}
            />
          </FormControl>
          <Button 
            type="submit" 
            fullWidth 
            variant="contained"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
} 