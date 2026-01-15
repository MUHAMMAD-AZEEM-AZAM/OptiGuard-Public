import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import SitemarkIcon from '../SitemarkIcon';


const items = [
  {
    icon: <SettingsSuggestRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Adaptable Performance',
    description:
      'Our AI-driven system seamlessly adapts to diverse eye health profiles, ensuring accurate and efficient detection tailored to individual needs.',
  },
  {
    icon: <ConstructionRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Built to Last',
    description:
      'Leverage a robust and reliable deep learning model that ensures consistent performance and a long-term impact on vision care.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Great User Experience',
    description:
      'Effortlessly integrate cutting-edge diagnostics into your routine with our intuitive, user-friendly interface designed for all users.',
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Innovative Functionality',
    description:
      'Redefine vision health with advanced features that accurately predict glaucoma and diabetic retinopathy, staying ahead in medical technology.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <SitemarkIcon />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}