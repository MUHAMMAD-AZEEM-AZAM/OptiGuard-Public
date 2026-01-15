import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { getUserDetails } from '../services/user';

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }

  return color;
}

const UserAvatar = ({ isLoggedIn}) => {
  const theme = useTheme();
  const userData = getUserDetails();

  const name = userData?.name || '';
  const email = userData?.email || '';
  const photo = userData?.picture; // assuming photo URL is stored as "photo"
  const firstLetter = name?.charAt(0).toUpperCase();
  const bgColor = stringToColor(name);

  return (
    <Tooltip title={isLoggedIn ? `${name} (${email})` : 'Not Logged In'} arrow>
      <Avatar
        src={photo || undefined}
        alt={name || 'User'}
        sx={{
          bgcolor: !photo && isLoggedIn ? bgColor : theme.palette.action.disabledBackground,
          color: !photo && isLoggedIn ? '#fff' : theme.palette.text.disabled,
          width: 34,
          height: 34,
          fontWeight: 600,
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          boxShadow: 1,
          cursor: 'pointer',
        }}
      >
        {!photo ? (isLoggedIn ? firstLetter : <PersonIcon fontSize="small" />) : null}
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
