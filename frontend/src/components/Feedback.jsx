import React, { useState } from 'react';
import {
    Box,
    InputLabel,
    Stack,
    TextareaAutosize,
    Button,
    Typography,
    Container,
    styled,
    alpha,
    Rating,
    useTheme,
} from '@mui/material';
import { feedback } from '../services/api'; // Ensure this is correctly imported
import useCustomSnackbar from '../hooks/useCustomSnackbar';

// Styled Textarea
const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    backgroundColor:
        theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.08)
            : alpha(theme.palette.grey[50], 0.6),
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    padding: '12px',
    border: `1px solid ${theme.palette.divider}`,
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    resize: 'none',
    '&:focus': {
        outline: `2px solid ${theme.palette.primary.main}`,
    },
}));

const Feedback = () => {
    const [value, setValue] = useState(0); // rating
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { showSuccess, showError } = useCustomSnackbar();
    const theme = useTheme();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const data = {
            message: message.trim(),
            rating: value,
        };

        try {
            const response = await feedback(data);
            if (response.success) {
                showSuccess(response.message || 'Feedback sent successfully!');
                setMessage('');
                setValue(0);
            } else {
                showError(response.message || 'Failed to send feedback.');
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message || 'Server error occurred');
            } else if (error.request) {
                showError('No response from server. Please try again.');
            } else {
                showError(error.message || 'An error occurred while sending your feedback.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={(theme) => ({
                width: '100%',
                backgroundImage:
                    theme.palette.mode === 'dark'
                        ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)'
                        : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
            })}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                 <Typography variant="h2" sx={{
                        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                        fontWeight: 700,
                        mb: 3,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Feedback
                    </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        maxWidth: '600px',
                    }}
                >
                    Tell us about your experience with our service. We value your feedback!
                </Typography>

                {/* Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Rate Your Experience
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Rating
                            name="centered-rating"
                            value={value}
                            onChange={(event, newValue) => setValue(newValue)}
                            precision={0.5}
                        />
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Selected Rating: {value} Stars
                    </Typography>

                    <Box>
                        <InputLabel htmlFor="message" sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}>
                            Your Message
                        </InputLabel>
                        <StyledTextarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            minRows={6}
                            placeholder="Comments..."
                            required
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        disabled={loading}
                        sx={{
                            borderRadius: '8px',
                            alignSelf: 'flex-start',
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Feedback;
