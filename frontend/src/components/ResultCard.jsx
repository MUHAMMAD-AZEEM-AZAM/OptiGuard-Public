import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  Rating,
  Button,
  Box,
} from '@mui/material';
import FeedbackDialog from './FeedbackDialog';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import useCustomSnackbar from '../hooks/useCustomSnackbar';
import { addFeedback } from '../services/api';

const ResultCard = ({ results, setResults }) => {
  const theme = useTheme();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [resultList, setResultList] = useState([]);
  const { showSuccess, showError } = useCustomSnackbar();
  const [recommendationItem, setRecommendationItem] = useState(null);

  // Update local state when props change
  useEffect(() => {
    setResultList(results);
  }, [results]);

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
        historyId: currentItem.historyId,
        rating,
        comment
      });

      const updatedResults = results.map((item) =>
        item.historyId === currentItem.historyId
          ? { ...item, feedback: { rating, comment } }
          : item
      );

      setResults(updatedResults); // <-- important
      showSuccess('Feedback submitted successfully');
      handleFeedbackClose();
    } catch (error) {
      showError('Failed to submit feedback');
    }
  };

  if (!resultList || resultList.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        No results to display. Uplaod images to see the results.
      </Typography>
    );
  }

  return (
    <TableContainer
      // component={Paper}
      sx={{
        borderRadius: '5px',
        width: { xs: '95%', sm: '90%', md: '85%', lg: '75%', xl: '65%' },
        margin: 'auto',
        padding: '40px 20px',
        backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.background.paper}` : '#fcfcfc',
        boxShadow: theme.shadows[4],
        mt: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: theme.palette.text.primary, textAlign: 'center' }}
      >
        Results
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.mode === 'dark' ? '#10151f' : '#f6f6f6' }}>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Image</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Prediction</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Name</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Status</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Date</TableCell>
            <TableCell sx={{ color: theme.palette.text.primary, fontWeight: '600' }}>Feedback</TableCell>
            <TableCell sx={{ fontWeight: '600', color: theme.palette.text.primary }}>Recommendations</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resultList.map((res, idx) => (
            <TableRow key={idx}>
              <TableCell>
                {res.imageUrl ? (
                  <img
                    src={res.imageUrl}
                    alt="result"
                    width="60"
                    height="60"
                    style={{ borderRadius: 4, objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', color: `${res.prediction == 'Normal' ? 'darkgreen' : 'darkred'}` }}>{res.prediction}</TableCell>
              <TableCell>{res.imageName}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color={res.prediction === 'Failed' ? 'error' : 'darkgreen'}

                >
                  {res.statusMessage}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(res.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell>
                {res.feedback ? (
                  <Box>
                    <Rating value={res.feedback.rating} readOnly size="small" />
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleFeedbackOpen(res)}
                    disabled={res.prediction === 'Failed'}
                  >
                    Feedback
                  </Button>
                )}
              </TableCell>
              <TableCell>
                {res.statusMessage === 'Success' ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setRecommendationItem(res)}
                  >
                    Recommendations
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.disabled,
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                    }}
                  >
                    No recommendations
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FeedbackDialog
        open={feedbackOpen}
        onClose={handleFeedbackClose}
        currentItem={currentItem}
        initialRating={currentItem?.feedback?.rating || 0}
        initialComment={currentItem?.feedback?.comment || ''}
        onSubmit={handleSubmitFeedback}
      />
      <Dialog open={!!recommendationItem?.recommendations} onClose={() => setRecommendationItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.3rem', backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.background.paper}` : '#fcfcfc', }}>
          Recommendations
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.mode === 'dark' ? `${theme.palette.background.paper}` : '#fcfcfc', }}>
          {recommendationItem?.recommendations?.length > 0 ? (
            <List sx={{ pl: 2 }}>
              {recommendationItem?.recommendations.map((rec, index) => (
                <ListItem key={index} disablePadding sx={{ alignItems: 'flex-start', mb: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 'bold', marginRight: 8 }}>{index + 1}.</span>{rec}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography textAlign="center">No recommendations available.</Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button onClick={() => setRecommendationItem(null)}>
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

    </TableContainer>
  );
};

export default ResultCard;
