import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import AppTheme from '../theme/AppTheme';
import { CssBaseline } from '@mui/material';

const NavFooterLayout = (props) => {
    return (
         <AppTheme {...props}>
         <CssBaseline enableColorScheme />
         <Navbar />
          <main style={{minHeight:'400px'}}><Outlet/></main>{/*height to keep the footer at bottom*/}
          <Footer />
       </AppTheme>
      );
}

export default NavFooterLayout