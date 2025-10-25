import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateHeating } from '../../store/reducers/calculation';

const CalculatorForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.calculation);
  const { currentProject } = useSelector((state) => state.project);

  const [formData, setFormData] = useState({
    projectId: currentProject?.id || null,  // Optional - can be null
    roomName: '',
    roomLength: '',
    roomWidth: '',
    pipeSpacing: 15,
    calculatePrice: false,
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
      pipeSpacing: parseFloat(formData.pipeSpacing),
      calculatePrice: formData.calculatePrice,
    };

    // Only include projectId if it exists
    if (formData.projectId) {
      calculationData.projectId = formData.projectId;
    }

    dispatch(calculateHeating(calculationData));
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Xona o'lchamlari / Размеры комнаты
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
                label="Xona nomi / Название комнаты"
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
                label="Uzunlik (m) / Длина (м)"
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
                label="Kenglik (m) / Ширина (м)"
                name="roomWidth"
                value={formData.roomWidth}
                onChange={handleChange}
                inputProps={{ min: 0.1, step: 0.1 }}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Shlanka oralig'i (sm) / Расстояние труб (см)"
                name="pipeSpacing"
                value={formData.pipeSpacing}
                onChange={handleChange}
                inputProps={{ min: 10, max: 30, step: 5 }}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="calculatePrice"
                    checked={formData.calculatePrice}
                    onChange={handleChange}
                  />
                }
                label="Narxni hisoblash / Рассчитать стоимость"
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
                {loading ? 'Hisoblanyapti...' : 'Hisoblash / Рассчитать'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CalculatorForm;
