import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 120,
              color: '#ef4444',
              mb: 3,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', md: '6rem' },
              fontWeight: 700,
              color: '#576861',
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#576861',
              mb: 1,
              fontWeight: 600,
            }}
          >
            Страница не найдена
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#6c757d',
              mb: 4,
            }}
          >
            К сожалению, запрашиваемая вами страница не существует.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              background: '#576861',
              '&:hover': {
                background: '#3f4f48',
              },
            }}
          >
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
