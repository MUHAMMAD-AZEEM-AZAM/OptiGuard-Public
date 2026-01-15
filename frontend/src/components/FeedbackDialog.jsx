import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography,
  Box
} from '@mui/material';

const FeedbackDialog = ({
  open,
  onClose,
  currentItem,
  initialRating = 0,
  initialComment = '',
  onSubmit
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment]);

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Rate This Prediction</DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography>How accurate was this prediction?</Typography>
          <Rating
            name="feedback-rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
          />
          <TextField
                id="message"
                name="message"
                value={comment}
            onChange={(e) => setComment(e.target.value)}
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Your Message"
                placeholder="Comments..."
                sx={{ width: '250px' }}
              />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!rating}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;