import { useState } from 'react';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { forgotPassword } from '../../services/api';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function ForgotPassword({ open, handleClose }) {
  const { showSuccess, showError } = useCustomSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');

    if (!email) {
      showError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      showSuccess('Password reset link sent to your email!');
      handleClose();
    } catch (error) {
      showError(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
