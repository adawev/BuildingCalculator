import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
import logo from '../../features/images/logo.png';

const API_URL = 'http://localhost:8080/api';

const MultiRoomCalculator = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('Мой дом');
  const [projectId, setProjectId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    name: '',
    length: '',
    width: '',
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const summaryTimeoutRef = useRef(null);

  // Debounced summary loader - wait 500ms after last change
  const loadSummaryDebounced = useCallback((pId) => {
    if (summaryTimeoutRef.current) {
      clearTimeout(summaryTimeoutRef.current);
    }
    summaryTimeoutRef.current = setTimeout(async () => {
      try {
        const summaryResp = await axios.get(`${API_URL}/projects/${pId}/summary`);
        setSummary(summaryResp.data);
      } catch (error) {
        console.error('Error loading summary:', error);
      }
    }, 500);
  }, []);

  const handleAddRoom = async () => {
    if (currentRoom.name && currentRoom.length && currentRoom.width) {
      try {
        setLoading(true);

        // Create project if not exists
        let pId = projectId;
        if (!pId) {
          const projectResp = await axios.post(`${API_URL}/projects`, {
            name: projectName,
          });
          pId = projectResp.data.id;
          setProjectId(pId);
        }

        // Add calculation for this room - skip materials in response
        const calcResp = await axios.post(`${API_URL}/calculations`, {
          roomName: currentRoom.name,
          roomLength: parseFloat(currentRoom.length),
          roomWidth: parseFloat(currentRoom.width),
          projectId: pId,
          calculatePrice: true,
        });

        // Add room to local state (without materials to save memory)
        const roomBasicInfo = {
          id: calcResp.data.id,
          roomName: calcResp.data.roomName,
          roomArea: calcResp.data.roomArea,
          pipeLengthWithReserve: calcResp.data.pipeLengthWithReserve,
        };
        setRooms([...rooms, roomBasicInfo]);
        setCurrentRoom({ name: '', length: '', width: '' });

        // Load summary with debounce (aggregated materials from server)
        loadSummaryDebounced(pId);
      } catch (error) {
        console.error('Error adding room:', error);
        alert('Ошибка при добавлении комнаты');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRoom = async (roomId, index) => {
    try {
      setRooms(rooms.filter((_, i) => i !== index));
      if (projectId) {
        loadSummaryDebounced(projectId);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const loadSummary = async (pId) => {
    try {
      const summaryResp = await axios.get(`${API_URL}/projects/${pId}/summary`);
      setSummary(summaryResp.data);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header with logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '16px' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', flexGrow: 1 }}>
            Расчет для всего дома
          </Typography>
        </Box>

        {/* Project Name */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={projectId !== null}
            variant="outlined"
            sx={{ mb: 0 }}
          />
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Add Room Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                Добавить комнату
              </Typography>

              <TextField
                fullWidth
                label="Название комнаты"
                value={currentRoom.name}
                onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                sx={{ mb: 2 }}
                placeholder="Например: Гостиная"
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Длина (м)"
                    value={currentRoom.length}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, length: e.target.value })}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ширина (м)"
                    value={currentRoom.width}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, width: e.target.value })}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
              </Grid>

              {currentRoom.length && currentRoom.width && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Площадь: <strong>{(parseFloat(currentRoom.length) * parseFloat(currentRoom.width)).toFixed(2)} м²</strong>
                </Alert>
              )}

              <Button
                variant="contained"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                onClick={handleAddRoom}
                disabled={loading || !currentRoom.name || !currentRoom.length || !currentRoom.width}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Добавление...' : 'Добавить'}
              </Button>
            </Paper>

            {/* Room List below Add Form */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                Добавленные комнаты ({rooms.length})
              </Typography>

              {rooms.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <HomeIcon sx={{ fontSize: 50, mb: 1, opacity: 0.3 }} />
                  <Typography variant="body2">
                    Комнат пока нет
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                  {rooms.map((room, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {room.roomName}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {room.roomArea.toFixed(1)} м² • {room.pipeLengthWithReserve.toFixed(0)} м
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteRoom(room.id, index)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < rooms.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {rooms.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Всего комнат:</strong> {rooms.length}
                  </Typography>
                  {summary && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Общая площадь:</strong> {summary.totalArea.toFixed(1)} м²
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Всего трубы:</strong> {summary.totalPipeLength.toFixed(0)} м
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Materials */}
          <Grid item xs={12} md={8}>
            {summary && summary.totalMaterials && summary.totalMaterials.length > 0 ? (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                  Необходимые материалы
                </Typography>

                {/* Key Metrics */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Комнат
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {summary.roomCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Площадь
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {summary.totalArea.toFixed(0)}
                        </Typography>
                        <Typography variant="caption">м²</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Труба
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {summary.totalPipeLength.toFixed(0)}
                        </Typography>
                        <Typography variant="caption">м</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
                      <CardContent sx={{ py: 2 }}>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Контуров
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          {Math.ceil(summary.totalPipeLength / 32)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Materials Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Материал</TableCell>
                        <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Количество</TableCell>
                        <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>Ед.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {summary.totalMaterials.map((material, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                            '&:hover': { bgcolor: 'action.selected' },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500 }}>{material.materialName}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {material.quantity.toFixed(2)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {material.unit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : (
              <Paper sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
                <CalculateIcon sx={{ fontSize: 80, mb: 2, opacity: 0.2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Добавьте комнаты
                </Typography>
                <Typography variant="body2">
                  Начните добавлять комнаты слева для расчета материалов
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default MultiRoomCalculator;
