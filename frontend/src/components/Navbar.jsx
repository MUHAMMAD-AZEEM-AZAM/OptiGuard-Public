import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Sitemark from './SitemarkIcon';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { useAuth } from '../context/AuthContext';
import LogoutDialog from './Authentication/LogoutDialog';
import UserAvatar from './UserAvatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/signin');
  };

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <NavLink to={'/'} style={{ marginTop: '6px', marginRight: '6px' }}>
                <Sitemark width={80} />
              </NavLink>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={NavLink}
                  to={'/'}
                  end
                  variant="text"
                  color="info"
                  size="small"
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      padding: '6px 12px',
                    },
                  })}
                >
                  Home
                </Button>
                <Button
                  component={NavLink}
                  to="/history"
                  variant="text"
                  color="info"
                  size="small"
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  })}
                >
                  History
                </Button>
                <Button
                  component={NavLink}
                  to={'/about'}
                  variant="text"
                  color="info"
                  size="small"
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  })}
                >
                  About Us
                </Button>
                <Button
                  component={NavLink}
                  to={'/contact'}
                  variant="text"
                  color="info"
                  size="small"
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    minWidth: 0,
                  })}
                >
                  Contact Us
                </Button>
                <Button
                  component={NavLink}
                  to={'/feedback'}
                  variant="text"
                  color="info"
                  size="small"
                  sx={(theme) => ({
                    '&.active': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    minWidth: 0,
                  })}
                >
                  Feedback
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              {isAuthenticated ? (
                <Button
                onClick={handleLogoutClick}
                variant="outlined"
                color="error"
                size="small"
                startIcon={<ExitToAppIcon fontSize="small" />}
                sx={{
                  fontWeight: 500,
                  borderWidth: '1px',
                  '&:hover': {
                    color: (theme) => theme.palette.error.main,
                    borderWidth: '1px',
                    boxShadow: '0 2px 4px rgba(220, 53, 69, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
              ) : (
                <>
                  <Button component={Link} to="/signin" color="primary" variant="text" size="small">
                    Sign in
                  </Button>
                  <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
                    Sign up
                  </Button>
                </>
              )}
              <UserAvatar isLoggedIn={isAuthenticated} />
              <ColorModeIconDropdown />
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <ColorModeIconDropdown size="medium" />
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    top: 'var(--template-frame-height, 0px)',
                  },
                }}
              >
                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <MenuItem
                    component={NavLink}
                    to={'/'}
                    end
                    onClick={toggleDrawer(false)}
                    sx={(theme) => ({
                      '&.active': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    })}
                  >
                    Home
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to={'/history'}
                    onClick={toggleDrawer(false)}
                    sx={(theme) => ({
                      '&.active': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    })}
                  >
                    History
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to={'/contact'}
                    onClick={toggleDrawer(false)}
                    sx={(theme) => ({
                      '&.active': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    })}
                  >
                    Contact Us
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to={'/about'}
                    onClick={toggleDrawer(false)}
                    sx={(theme) => ({
                      '&.active': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    })}
                  >
                    About Us
                  </MenuItem>
                  <MenuItem
                    component={NavLink}
                    to={'/feedback'}
                    onClick={toggleDrawer(false)}
                    sx={(theme) => ({
                      '&.active': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    })}
                  >
                    Feedback
                  </MenuItem>
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <UserAvatar isLoggedIn={isAuthenticated} />
                    {isAuthenticated ? (
                      <Button
                        onClick={handleLogoutClick}
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<ExitToAppIcon fontSize="small" />}
                        sx={{
                          fontWeight: 500,
                          borderWidth: '1px',
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                            borderWidth: '1px',
                            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.1)'
                          }
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button component={Link} to="/signin" color="primary" variant="text" size="small">
                          Sign in
                        </Button>
                        <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
                          Sign up
                        </Button>
                      </>
                    )}
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}