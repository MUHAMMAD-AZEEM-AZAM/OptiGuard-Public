import React, { useState } from 'react';
import {
    Box,
    InputLabel,
    Stack,
    TextareaAutosize,
    TextField,
    Button,
    Typography,
    Container,
    styled,
    alpha,
    useTheme,
} from '@mui/material';
import SitemarkIcon from './SitemarkIcon';
import { contactUs } from '../services/api';
import useCustomSnackbar from '../hooks/useCustomSnackbar';

// Styled Textarea component with theme awareness
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

const ContactUS = () => {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useCustomSnackbar();
    const theme = useTheme();
    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);
        const message = formData.get('message');
        const data = { message }
        try {
            const response = await contactUs(data);
            if (response.success) {
                showSuccess(response.message || 'Message sent successfully!');
                event.target.reset();
            } else {
                showError(response.message || 'Failed to send message');
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                showError(error.response.data.message || 'Server error occurred');
            } else if (error.request) {
                // The request was made but no response was received
                showError('No response from server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                showError(error.message || 'An error occurred while sending your message');
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
                    mt: { xs: 4, sm: 0 },
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
                    Contact Us
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        mb: 4,
                        maxWidth: '600px',
                    }}
                >
                    Facing some issues? Have a question? Reach out to us now, and we'll be happy to
                    assist you!
                </Typography>

                {/* Form Section */}
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
                    {/* Email Field */}
                    {/* <Box>
                        <InputLabel
                            htmlFor="email-contact"
                            sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}
                        >
                            Email
                        </InputLabel>
                        <TextField
                            id="email-contact"
                            variant="outlined"
                            placeholder="Enter your email address"
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                },
                            }}
                        />
                    </Box> */}

                    {/* Message Field */}
                    <Box>
                        <InputLabel
                            htmlFor="message"
                            sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}
                        >
                            Your Message
                        </InputLabel>
                        <StyledTextarea
                            id="message"
                            name='message'
                            minRows={6}
                            placeholder="Write your message here..."
                        />
                    </Box>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="medium"
                        sx={{
                            borderRadius: '8px',
                            alignSelf: 'flex-start',
                        }}
                    >
                        Send Message to Admin
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ContactUS;
