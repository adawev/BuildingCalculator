import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateHeating } from '../../store/reducers/calculation';

const CalculatorForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.calculation);
  const { currentProject } = useSelector((state) => state.project);

  const [formData, setFormData] = useState({
    projectId: currentProject?.id || null,
    roomName: '',
    roomLength: '',
    roomWidth: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const calculationData = {
      roomName: formData.roomName,
      roomLength: parseFloat(formData.roomLength),
      roomWidth: parseFloat(formData.roomWidth),
      calculatePrice: true,  // Always calculate materials
    };

    if (formData.projectId) {
      calculationData.projectId = formData.projectId;
    }

    dispatch(calculateHeating(calculationData));
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Размеры комнаты
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название комнаты"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Длина (м)"
                name="roomLength"
                value={formData.roomLength}
                onChange={handleChange}
                inputProps={{ min: 0.1, step: 0.1 }}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Ширина (м)"
                name="roomWidth"
                value={formData.roomWidth}
                onChange={handleChange}
                inputProps={{ min: 0.1, step: 0.1 }}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
                sx={{ py: 1.2, mt: 1 }}
              >
                {loading ? 'Рассчитывается...' : 'Рассчитать'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
