import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logo from '../../features/images/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Расчет дома',
      description: 'Добавьте комнаты и рассчитайте материалы',
      icon: <ApartmentIcon sx={{ fontSize: 60 }} />,
      color: '#576861',
      path: '/multi-room',
    },
    {
      title: 'Материалы',
      description: 'Управление базой материалов',
      icon: <BuildIcon sx={{ fontSize: 60 }} />,
      color: '#22c55e',
      path: '/materials',
    },
    {
      title: 'История',
      description: 'История всех расчетов',
      icon: <AssessmentIcon sx={{ fontSize: 60 }} />,
      color: '#f59e0b',
      path: '/history',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <img src={logo} alt="Logo" style={{ height: '150px', marginBottom: '24px' }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            Калькулятор теплого пола
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Рассчитайте необходимые материалы для системы подогрева пола
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Grid container spacing={4}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(item.path)}
                  sx={{ height: '100%', p: 4 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: item.color, mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
