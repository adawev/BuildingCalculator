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
  CardMedia,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ArchitectureIcon from '@mui/icons-material/Architecture';

const LandingPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      titleUz: 'Bitta xona hisoblash',
      titleRu: 'Расчет одной комнаты',
      descriptionUz: 'Bir xona uchun material va narxni hisoblang',
      descriptionRu: 'Рассчитайте материалы и стоимость для одной комнаты',
      icon: <HomeIcon sx={{ fontSize: 80, color: 'primary.main' }} />,
      path: '/calculator',
      available: true,
    },
    {
      id: 2,
      titleUz: 'Katta uy hisoblash',
      titleRu: 'Расчет большого дома',
      descriptionUz: 'Ko\'p xonali uy uchun to\'liq hisob',
      descriptionRu: 'Полный расчет для дома с несколькими комнатами',
      icon: <ApartmentIcon sx={{ fontSize: 80, color: 'success.main' }} />,
      path: '/multi-room',
      available: true,
    },
    {
      id: 3,
      titleUz: 'Proyekt chizmasi',
      titleRu: 'Проектный чертеж',
      descriptionUz: 'Xonalarda trubalarning joylashuvi (tez orada)',
      descriptionRu: 'Визуализация укладки труб (скоро)',
      icon: <ArchitectureIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
      path: '/project-drawing',
      available: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Tyopliy Pol Kalkulyator
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.5rem' },
            }}
          >
            Калькулятор теплых полов
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
                        mb: 1,
                        color: 'text.primary',
                      }}
                    >
                      {option.titleUz}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 400,
                        mb: 2,
                        color: 'text.secondary',
                        fontSize: '1rem',
                      }}
                    >
                      {option.titleRu}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: 'text.secondary', mb: 1 }}
                    >
                      {option.descriptionUz}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {option.descriptionRu}
                    </Typography>

                    {!option.available && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          color: 'warning.main',
                          fontStyle: 'italic',
                        }}
                      >
                        Tez orada / Скоро
                      </Typography>
                    )}
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
