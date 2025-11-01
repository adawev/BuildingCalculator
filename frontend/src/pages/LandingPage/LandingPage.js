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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, sm: 6 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: window.innerWidth < 600 ? '100px' : '150px',
              marginBottom: '24px'
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Калькулятор теплого пола
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              px: { xs: 2, sm: 0 }
            }}
          >
            Рассчитайте необходимые материалы для системы подогрева пола
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  sx={{
                    height: '100%',
                    p: { xs: 3, sm: 4 }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Box sx={{ color: item.color, mb: 2 }}>
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: { xs: 50, sm: 60 } }
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
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
