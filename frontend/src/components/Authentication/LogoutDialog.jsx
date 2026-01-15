import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function LogoutDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { backgroundImage: 'none' }
      }}
    >
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to logout?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  );
} 