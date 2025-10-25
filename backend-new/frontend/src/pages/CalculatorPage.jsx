import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculatorForm from '../components/CalculatorForm';
import ResultsDisplay from '../components/ResultsDisplay';

const CalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Orqaga / Назад
        </Button>

        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}
        >
          Bitta xona hisoblash / Расчет одной комнаты
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CalculatorForm />
          </Grid>
          <Grid item xs={12} md={7}>
            <ResultsDisplay />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CalculatorPage;
