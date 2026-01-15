import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import { GoogleIcon } from './CustomIcons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { googleAuth } from '../../services/api';

const GoogleSignIn = ({ variant = "outlined", fullWidth = true }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError } = useCustomSnackbar();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const data = await googleAuth(credentialResponse.credential);
            login(data.token, data.user, true);
            showSuccess('Successfully signed in with Google!');
            navigate('/');
        } catch (error) {
            showError(error.message);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <Button
                fullWidth={fullWidth}
                variant={variant}
                startIcon={<GoogleIcon />}
                sx={{ position: 'relative', zIndex: 1 }}
            >
                Continue with Google
            </Button>
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                opacity: 0, 
                zIndex: 2 
            }}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        showError('Google sign-in failed');
                    }}
                    // useOneTap
                    type="standard"
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    );
};

export default GoogleSignIn;