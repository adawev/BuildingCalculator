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
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 3, sm: 6, md: 8 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6, md: 8 } }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: window.innerWidth < 600 ? '100px' : '150px',
              marginBottom: '32px',
              transition: 'transform 0.3s ease',
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
              px: { xs: 2, sm: 0 },
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Рассчитайте необходимые материалы для системы подогрева пола
          </Typography>
        </Box>

        {/* Menu Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
        >
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: { xs: '200px', sm: '250px', md: '280px' },
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: 8,
                    '& .card-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(item.path)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, sm: 4, md: 5 },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      p: 0,
                      width: '100%',
                    }}
                  >
                    <Box
                      className="card-icon"
                      sx={{
                        color: item.color,
                        mb: { xs: 2, sm: 3 },
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: { xs: 50, sm: 60, md: 70 } }
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                        color: 'primary.main',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.6,
                        px: { xs: 1, sm: 2 },
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

        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 6, sm: 8, md: 10 },
            pt: { xs: 3, sm: 4 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            © 2024 UstaBek. Профессиональный калькулятор теплого пола
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
