import React from 'react';
import { styled } from '@mui/material/styles';
import { SnackbarContent } from 'notistack';
import { Paper } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme, variant }) => ({
  backgroundColor: 
    variant === 'success' ? theme.palette.success.main :
    variant === 'error' ? theme.palette.error.main :
    variant === 'warning' ? theme.palette.warning.main :
    theme.palette.info.main,
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
}));

const CustomSnackbar = React.forwardRef((props, ref) => {
  const { variant, message } = props;

  return (
    <SnackbarContent ref={ref}>
      <StyledPaper variant={variant}>
        {message}
      </StyledPaper>
    </SnackbarContent>
  );
});

export default CustomSnackbar; 