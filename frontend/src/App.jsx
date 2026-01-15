import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './layouts/NavFooterLayout';
import HomePage from './pages/HomePage';
import SignInPage from './pages/Authentication/SignInPage';
import SignUp from './pages/Authentication/SignUp';
import OTPVerification from './components/Authentication/OTPVerification';
import History from './components/History';
import AboutUs from './components/AboutUs';
import ContactUS from './components/ContactUS';
import Feedback from './components/Feedback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import { SnackbarProvider } from 'notistack';
import ResetPassword from './components/Authentication/ResetPassword';
import CustomSnackbar from './components/CustomSnackbar';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout />}>
          <Route index element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/history' element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path='/about' element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } />
          <Route path='/contact' element={
            <ProtectedRoute>
              <ContactUS />
            </ProtectedRoute>
          } />
          <Route path='/feedback' element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
        </Route>
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-otp' element={<OTPVerification />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </>
    )
  )

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SnackbarProvider 
        maxSnack={3} 
        autoHideDuration={3000} // 3 seconds
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        // Optional: Add custom styles for different variants
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
          warning: CustomSnackbar,
          info: CustomSnackbar,
        }}
      >
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SnackbarProvider>
    </GoogleOAuthProvider>
  )
}

export default App;
