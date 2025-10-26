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
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import logo from '../../features/images/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      title: 'Расчет одной комнаты',
      description: 'Быстрый расчет материалов для одной комнаты',
      icon: <HomeIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
      path: '/calculator',
      available: true,
    },
    {
      id: 2,
      title: 'Расчет для всего дома',
      description: 'Полный расчет материалов для нескольких комнат с итоговым отчетом',
      icon: <ApartmentIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
      path: '/multi-room',
      available: true,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #576861 0%, #3f4f48 100%)',
        pt: 6,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ mb: 3 }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                maxWidth: '200px',
                height: 'auto',
                marginBottom: '1rem'
              }}
            />
          </Box>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Калькулятор теплого пола
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              fontSize: { xs: '0.9rem', md: '1.2rem' },
            }}
          >
            Профессиональный расчет материалов для водяного теплого пола
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {options.map((option) => (
            <Grid item xs={12} md={4} key={option.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  opacity: option.available ? 1 : 0.6,
                  '&:hover': option.available
                    ? {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      }
                    : {},
                }}
              >
                <CardActionArea
                  onClick={() => option.available && navigate(option.path)}
                  disabled={!option.available}
                  sx={{ height: '100%' }}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      py: 5,
                      px: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ mb: 3 }}>{option.icon}</Box>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: 'primary.main',
                      }}
                    >
                      {option.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary' }}
                    >
                      {option.description}
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
