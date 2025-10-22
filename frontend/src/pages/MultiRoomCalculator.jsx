import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import { calculateHeating } from '../redux/calculationSlice';

const MultiRoomCalculator = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    name: '',
    length: '',
    width: '',
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAddRoom = () => {
    if (currentRoom.name && currentRoom.length && currentRoom.width) {
      const area = parseFloat(currentRoom.length) * parseFloat(currentRoom.width);
      setRooms([...rooms, { ...currentRoom, area: area.toFixed(2) }]);
      setCurrentRoom({ name: '', length: '', width: '' });
    }
  };

  const handleDeleteRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const getTotalArea = () => {
    return rooms.reduce((sum, room) => sum + parseFloat(room.area), 0).toFixed(2);
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const totalArea = getTotalArea();
      const avgLength = Math.sqrt(parseFloat(totalArea));

      // Calculate for combined area
      const result = await dispatch(calculateHeating({
        projectId: 1,
        roomName: `Katta uy - ${rooms.length} xona`,
        roomLength: avgLength,
        roomWidth: avgLength,
        pipeSpacing: 15,
        calculatePrice: true,
      })).unwrap();

      setResults(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
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
          Katta uy hisoblash / Расчет большого дома
        </Typography>

        <Grid container spacing={3}>
          {/* Add Room Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Xona qo'shish / Добавить комнату
              </Typography>

              <TextField
                fullWidth
                label="Xona nomi / Название"
                value={currentRoom.name}
                onChange={(e) =>
                  setCurrentRoom({ ...currentRoom, name: e.target.value })
                }
                sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Uzunlik (m) / Длина"
                    value={currentRoom.length}
                    onChange={(e) =>
                      setCurrentRoom({ ...currentRoom, length: e.target.value })
                    }
                    inputProps={{ min: 0.1, step: 0.1 }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Kenglik (m) / Ширина"
                    value={currentRoom.width}
                    onChange={(e) =>
                      setCurrentRoom({ ...currentRoom, width: e.target.value })
                    }
                    inputProps={{ min: 0.1, step: 0.1 }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '1.05rem', py: 1.5 } }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleAddRoom}
                sx={{ mt: 2 }}
              >
                Xona qo'shish / Добавить
              </Button>
            </Paper>
          </Grid>

          {/* Room List */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Qo'shilgan xonalar / Добавленные комнаты
              </Typography>

              {rooms.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  Hozircha xonalar yo'q / Комнат пока нет
                </Typography>
              ) : (
                <List>
                  {rooms.map((room, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={room.name}
                          secondary={`${room.length} × ${room.width} m = ${room.area} m²`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteRoom(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < rooms.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>

            {rooms.length > 0 && (
              <Card sx={{ mt: 3, bgcolor: 'primary.light' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Jami maydon / Общая площадь
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    {getTotalArea()} m²
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mt: 1 }}>
                    Xonalar soni: {rooms.length}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {rooms.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
              onClick={handleCalculate}
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? 'Hisoblanyapti...' : 'Hisoblash / Рассчитать'}
            </Button>
          </Box>
        )}

        {results && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Natijalar / Результаты
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="caption">Jami maydon</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.roomArea} m²
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="caption">Shlanka</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.pipeLengthWithReserve} m
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="caption">Halqalar</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.numberOfLoops}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="caption">Jami narx</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {results.totalCost?.toFixed(0)} so'm
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info">
              <Typography variant="body2">
                <strong>Xonalar soni:</strong> {rooms.length} ta
              </Typography>
              <Typography variant="body2">
                <strong>O'rtacha maydon:</strong> {(getTotalArea() / rooms.length).toFixed(2)} m² har bir xona
              </Typography>
            </Alert>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default MultiRoomCalculator;
