import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import SitemarkIcon from './SitemarkIcon';
import { newsletterSubscribe } from '../services/api';
import { useState } from 'react';
import useCustomSnackbar from '../hooks/useCustomSnackbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@emotion/react';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <Link color="text.secondary">
        OptiGuard
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useCustomSnackbar();
  const [subscribed, setSubscribed] = useState(false);


  const bounce = keyframes`
0% { transform: scale(0); }
50% { transform: scale(1.3); }
100% { transform: scale(1); }
`;

  // Check local storage for subscription status
  React.useEffect(() => {
    const isSubscribed = localStorage.getItem('isSubscribed');
    if (isSubscribed) {
      setSubscribed(true);
    }
  }, []);

  console.log(subscribed)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await newsletterSubscribe();
      if (response.success) {
        showSuccess(response.message || 'Subscribed successfully!');
        // Save status after successful subscription
        localStorage.setItem('isSubscribed', 'true');
        setSubscribed(true);  // ✅ update state
        event.target.reset();
      } else {
        showError(response.message || 'Failed to subscribe');
      }
    } catch (error) {
      if (error.response) {
        showError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        showError('No response from server. Please try again.');
      } else {
        showError(error.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 1, sm: 2 },
        py: { xs: 4, sm: 5 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 2, sm: 4 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      ></Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }} component="form" onSubmit={handleSubmit}>
            <SitemarkIcon />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Subscribe for updates. No spams ever!
            </Typography>
            <Button
              variant="contained"
              color={subscribed ? "success" : "primary"}
              size="small"
              type="submit"
              sx={{ flexShrink: 0, gap: 1 }}
              disabled={subscribed}
            >
              {subscribed ? (
                <>
                  Subscribed
                  <CheckCircleIcon
                    sx={{
                      animation: `${bounce} 0.6s ease`,
                      fontSize: '1rem',
                    }}
                  />
                </>
              ) : (
                'Subscribe'
              )}
            </Button>

          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Product
          </Typography>
          <Link color="text.secondary" variant="body2" href="/#image-analysis">
            Disease Detection
          </Link>
          <Link color="text.secondary" variant="body2" href="/history">
            History
          </Link>
          {/* <Link color="text.secondary" variant="body2" href="#">
            Testimonials
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Highlights
          </Link> */}
          {/* <Link color="text.secondary" variant="body2" href="#">
            Pricing
          </Link> */}
          <Link component={RouterLink} color="text.secondary" variant="body2" href="/#faq">
            FAQs
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Company
          </Typography>
          <Link color="text.secondary" variant="body2" href="/about">
            About us
          </Link><Link color="text.secondary" variant="body2" href="/contact">
            Contact us
          </Link>
          <Link
            color="text.secondary"
            variant="body2"
            href="/user-manual.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            User Manual
          </Link>
          {/* <Link color="text.secondary" variant="body2" href="#">
            Careers
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Press
          </Link> */}
        </Box>
        {/* <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Legal
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy
          </Link>
        </Box> */}
      </Box>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 2, sm: 4 },
          width: '100%',

        }}
      >
        <div>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            // href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            // href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            // href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box> */}
    </Container>
  );
}