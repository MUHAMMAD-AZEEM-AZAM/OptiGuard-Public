import {
    Box, Container, Typography, Card, CardContent, Chip, Button,
    Avatar, useTheme, Paper, alpha, styled
} from '@mui/material';
import React from 'react';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccuracyIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[8],
    },
}));

const DiseaseCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${theme.palette.background.paper} 100%)`,
}));

const ProcessContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(4, 0),
    [theme.breakpoints.up('md')]: {
        '&:before': {
            content: '""',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '100%',
            height: '4px',
            width: '80%',
            backgroundColor: theme.palette.primary.main,
            zIndex: 0,
        },
    },
}));

const StepIndicator = styled(Box)(({ theme }) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: theme.palette.background.paper,
    border: `4px solid ${theme.palette.primary.main}`,
    position: 'absolute',
    [theme.breakpoints.up('md')]: {
        top: '118%',
        transform: 'translateY(-50%)',
    },
    [theme.breakpoints.down('md')]: {
        left: -12,
        top: 20,
    },
}));

const AboutUs = () => {
    const theme = useTheme();

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box
            id="about-us"
            sx={{
                width: '100%',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #05070a 0%, #05070a 100%)'
                    : 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)',
            }}
        >
            <Container sx={{ py: 8 }}>
                {/* Hero Section */}
                <Box textAlign="center" mb={8} mt={8}>
                    <Typography variant="h2" sx={{
                        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                        fontWeight: 700,
                        mb: 3,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Revolutionizing Eye Disease Detection
                    </Typography>
                </Box>

                {/* Diseases Section */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    mb: 8,
                    alignItems: 'stretch' // Ensures equal height
                }}>
                    {/* Diabetic Retinopathy Card */}
                    <Box sx={{ flex: 1, minWidth: 0 }}> {/* Equal width wrapper */}
                        <DiseaseCard elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                                    <MedicalServicesIcon />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Diabetic Retinopathy (DR)
                                </Typography>
                            </Box>
                            <Typography color="text.secondary" mb={2}>
                                A diabetes complication affecting eyes. Our system detects:
                            </Typography>
                            <ul style={{
                                paddingLeft: '1.5rem',
                                color: theme.palette.text.secondary,
                                flexGrow: 1 // Pushes chip to bottom
                            }}>
                                <li>Microaneurysms</li>
                                <li>Hemorrhages</li>
                                <li>Exudates</li>
                                <li>Neovascularization</li>
                            </ul>
                            {/* <Chip label="95% Accuracy" color="success" sx={{ mt: 2, alignSelf: 'flex-start' }} /> */}
                        </DiseaseCard>
                    </Box>

                    {/* Glaucoma Card */}
                    <Box sx={{ flex: 1, minWidth: 0 }}> {/* Equal width wrapper */}
                        <DiseaseCard elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <MedicalServicesIcon />
                                </Avatar>
                                <Typography variant="h5" fontWeight="bold">
                                    Glaucoma
                                </Typography>
                            </Box>
                            <Typography color="text.secondary" mb={2}>
                                Early detection of optic nerve damage:
                            </Typography>
                            <ul style={{
                                paddingLeft: '1.5rem',
                                color: theme.palette.text.secondary,
                                flexGrow: 1 // Pushes chip to bottom
                            }}>
                                <li>Cup-to-disc ratio analysis</li>
                                <li>Nerve fiber layer assessment</li>
                                <li>Intraocular pressure correlation</li>
                                <li>Visual field defects</li>
                            </ul>
                            {/* <Chip label="93% Accuracy" color="success" sx={{ mt: 2, alignSelf: 'flex-start' }} /> */}
                        </DiseaseCard>
                    </Box>
                </Box>

                {/* How It Works */}
                <Typography variant="h4" textAlign="center" mb={6} fontWeight="bold">
                    How Our System Works
                </Typography>

                <ProcessContainer>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: 4,
                        position: 'relative'
                    }}>
                        <StepIndicator sx={{
                            [theme.breakpoints.up('md')]: { left: '15%' },
                            [theme.breakpoints.down('md')]: { display: 'none' }
                        }} />
                        <StepIndicator sx={{
                            [theme.breakpoints.up('md')]: { left: '50%' },
                            [theme.breakpoints.down('md')]: { display: 'none' }
                        }} />
                        <StepIndicator sx={{
                            [theme.breakpoints.up('md')]: { left: '85%' },
                            [theme.breakpoints.down('md')]: { display: 'none' }
                        }} />

                        {[
                            {
                                icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
                                title: 'Multi-Image Upload',
                                text: 'Upload multiple fundus images simultaneously'
                            },
                            {
                                icon: <ScienceIcon sx={{ fontSize: 40 }} />,
                                title: 'Deep Learning Analysis',
                                text: 'CNN models process images through neural networks'
                            },
                            {
                                icon: <HistoryIcon sx={{ fontSize: 40 }} />,
                                title: 'Instant Results & History',
                                text: 'Detailed reports with secure history storage'
                            }
                        ].map((step, index) => (
                            <Box key={index} sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: { xs: 'row', md: 'column' },
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: 'background.paper',
                                p: 3,
                                borderRadius: 2,
                                boxShadow: 2,
                                position: 'relative'
                            }}>
                                <Box sx={{ color: 'primary.main' }}>{step.icon}</Box>
                                <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                                    <Typography variant="h6" fontWeight="bold" mb={1}>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.text}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </ProcessContainer>

                {/* Key Features */}
                <Typography variant="h4" textAlign="center" my={6} fontWeight="bold">
                    Why Choose OptiGuard?
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    mb: 8
                }}>
                    {[
                        {
                            icon: <AccuracyIcon />,
                            title: 'Clinical-grade Accuracy',
                            text: 'Validated against medical expert diagnoses'
                        },
                        {
                            icon: <CloudUploadIcon />,
                            title: 'Batch Processing',
                            text: 'Analyze up to 20 images simultaneously'
                        },
                        {
                            icon: <HistoryIcon />,
                            title: 'Smart History',
                            text: 'Track progression with visual timelines'
                        },
                    ].map((feature, index) => (
                        <StyledCard key={index} sx={{ flex: 1 }}>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <Avatar sx={{
                                    bgcolor: 'primary.main',
                                    width: 56,
                                    height: 56,
                                    mb: 2,
                                    mx: 'auto'
                                }}>
                                    {feature.icon}
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {feature.text}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    ))}
                </Box>

                {/* Call to Action */}
                <Box textAlign="center" mt={8}>
                    <Button
                        component={Link}
                        to="/"
                        onClick={handleScrollToTop}
                        variant="contained"
                        size="medium"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                            py: 2,
                            px: 6,
                            borderRadius: '50px',
                            fontSize: '1rem',
                            boxShadow: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4
                            }
                        }}
                    >
                        Start Free Analysis
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;