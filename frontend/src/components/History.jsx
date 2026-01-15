import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardMedia, CardContent,
  Chip, Rating, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, CircularProgress,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getUserHistory, addFeedback, clearUserHistory, deleteHistoryItem
} from '../services/api';
import useCustomSnackbar from '../hooks/useCustomSnackbar';
import { format } from 'date-fns';
import FeedbackDialog from './FeedbackDialog';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showSuccess, showError } = useCustomSnackbar();
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getUserHistory();
      setHistory(response.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      if (error.response?.status === 401) localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackOpen = (item) => {
    setCurrentItem(item);
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    setCurrentItem(null);
  };

  const handleSubmitFeedback = async ({ rating, comment }) => {
    try {
      await addFeedback({
        historyId: currentItem._id,
        rating,
        comment
      });
      console.log(currentItem._id)
      showSuccess('Feedback submitted successfully');
      setHistory(prev => prev.map(item =>
        item._id === currentItem._id
          ? { ...item, feedback: { rating, comment } }
          : item
      ));

      // 3️⃣ Sync with sessionStorage "results" array
      const stored = sessionStorage.getItem('results');
      const results = stored ? JSON.parse(stored) : [];

      const updatedResults = results.map(obj =>
        obj.historyId === currentItem._id
          ? {
            ...obj,
            feedback: { rating, comment }
          }
          : obj
      );

      sessionStorage.setItem('results', JSON.stringify(updatedResults));

    } catch (error) {
      showError('Failed to submit feedback');
    } finally {
      handleFeedbackClose();
    }
  };

  const handleClearHistory = async () => {
    try {
      setClearing(true);
      await clearUserHistory();
      showSuccess('History cleared successfully');
      setHistory([]);
      sessionStorage.removeItem('results');
    } catch (error) {
      showError('Failed to clear history');
    } finally {
      setClearing(false);
      setClearDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      setDeletingId(id);
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      //remove the item from the sessionStorage
      const results = sessionStorage.getItem('results');
      let updatedResults = [];
      if (results) {
        const resultsArray = JSON.parse(results);
        updatedResults = resultsArray.filter(obj => obj.historyId !== id);
        sessionStorage.setItem('results', JSON.stringify(updatedResults));
      }
      showSuccess('Item deleted');
    } catch (error) {
      showError('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (result) => {
    switch (result.predictedClass) {
      case 'Normal': return 'success';
      case 'Glaucoma':
      case 'DR': return 'error';
      default: return 'info';
    }
  };

  const ClearConfirmationDialog = () => (
    <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
      <DialogTitle>Confirm Clear History</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete all your history? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={handleClearHistory}
          color="error"
          variant="contained"
          disabled={clearing}
          startIcon={clearing && <CircularProgress size={18} />}
        >
          {clearing ? 'Clearing...' : 'Confirm Clear'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={(theme) => ({
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
      backgroundImage: theme.palette.mode === 'dark'
        ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 255, 0.1), transparent)'
        : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 255, 0.2), transparent)',
      py: 4
    })}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, mt: 8 }}>
          Your Eye Health History
        </Typography>

        {loading ? (
          <Typography textAlign="center">Loading your history...</Typography>
        ) : history.length === 0 ? (
          <Typography textAlign="center">No history found. Upload an image to get started.</Typography>
        ) : (
          <>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setClearDialogOpen(true)}
                disabled={clearing}
                startIcon={clearing && <CircularProgress size={18} />}
              >
                {clearing ? 'Clearing...' : 'Clear History'}
              </Button>
            </Box>

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
              '&:hover .history-card:not(:hover)': {
                opacity: 0.8
              }
            }}>
              {history.map((item) => (
                <Card
                  key={item._id}
                  className="history-card"
                  sx={{
                    width: { xs: '100%', sm: '35%', md: '25%' }, // Reduced from 45%/30%
                    maxWidth: 300, // Reduced from 360
                    borderRadius: 1,
                    boxShadow: 4,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)', // Reduced lift
                      boxShadow: 6,
                      opacity: '1 !important',
                      '& .delete-button': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <Box
                    component="span"
                    onClick={() => handleDeleteItem(item._id)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        color: 'error.main'
                      }
                    }}
                  >
                    {deletingId === item._id ? (
                      <CircularProgress size={24} color="error" />
                    ) : (
                      <DeleteIcon
                        sx={{
                          fontSize: '1.5rem',
                          color: 'white',
                          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
                          '&:hover': {
                            color: 'error.main'
                          }
                        }}
                      />
                    )}
                  </Box>

                  <CardMedia
                    component="img"
                    height="160" // Reduced from 200
                    image={item.imageUrl}
                    alt="Eye scan"
                    sx={{
                      width: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      aspectRatio: '1',
                    }}
                  />

                  <CardContent sx={{
                    p: 1.5, // Reduced from 2
                    position: 'relative',
                    zIndex: 1,
                    bgcolor: 'background.paper'
                  }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5 // Reduced from 1
                    }}>
                     { isLightMode ? (
                      <Chip
                        label= {item.result.predictedClass == 'DR' ? 'Diabetic Retinopathy' : item.result.predictedClass}
                        color={getStatusColor(item.result)}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          py: 1.5,
                          px: 0.5,
                          fontSize: '0.75rem',
                        }}
                      />
                      ) : (
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        fontSize="13px"
                        color={getStatusColor(item.result)}
                      >
                         {item.result.predictedClass == 'DR' ? 'Diabetic Retinopathy' : item.result.predictedClass}
                      </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </Box>

                    {item.feedback ? (
                      <Box sx={{ mt: 2, textAlign: 'center' }}> {/* Reduced from 1 */}
                        <Rating value={item.feedback.rating} readOnly size="small" /> {/* Changed to small */}
                      </Box>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                          mt: 0.5, // Reduced from 1
                          py: 0.5 // Reduced button padding
                        }}
                        onClick={() => handleFeedbackOpen(item)}
                      >
                        Add Feedback
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        <ClearConfirmationDialog />
        <FeedbackDialog
          open={feedbackOpen}
          onClose={handleFeedbackClose}
          currentItem={currentItem}
          initialRating={currentItem?.feedback?.rating || 0}
          initialComment={currentItem?.feedback?.comment || ''}
          onSubmit={handleSubmitFeedback}
        />
      </Container>
    </Box>
  );
};

export default History;