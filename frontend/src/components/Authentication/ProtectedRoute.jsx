import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useCustomSnackbar from '../../hooks/useCustomSnackbar';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { showError } = useCustomSnackbar();
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      showError('Please sign in to access this page');
      navigate('/signin');
    }
  }, [isAuthenticated, navigate, showError]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 