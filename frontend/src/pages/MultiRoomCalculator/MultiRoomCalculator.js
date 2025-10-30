import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../features/images/logo.png';

const API_URL = 'https://api.ustabek.uz/api';

const MultiRoomCalculator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectName, setProjectName] = useState('Проект #1');
  const [projectId, setProjectId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({
    name: '',
    length: '',
    width: '',
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [summary, setSummary] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, room: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, roomId: null, roomName: '' });
  const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const summaryTimeoutRef = useRef(null);

  // Load project from URL or fetch next project number
  useEffect(() => {
    const fetchNextProjectNumber = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects`);
        const projects = response.data;
        // Find the highest project number
        let maxNumber = 0;
        projects.forEach(project => {
          const match = project.name.match(/Проект #(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        });
        setProjectName(`Проект #${maxNumber + 1}`);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjectName('Проект #1');
      }
    };

    const projectIdFromUrl = searchParams.get('projectId');
    if (projectIdFromUrl) {
      loadProject(projectIdFromUrl);
    } else {
      fetchNextProjectNumber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Load existing project
  const loadProject = async (pId) => {
    try {
      setLoading(true);

      // Get project details
      const projectResp = await axios.get(`${API_URL}/projects/${pId}`);
      setProjectName(projectResp.data.name);
      setProjectId(pId);

      // Get all calculations for this project
      const calcsResp = await axios.get(`${API_URL}/calculations/project/${pId}`);
      setRooms(calcsResp.data);

      // Load summary
      loadSummaryDebounced(pId);

      showNotification('Project yuklandi!', 'success');
    } catch (error) {
      console.error('Error loading project:', error);
      showNotification('Project yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Debounced summary loader
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

        // Add calculation WITHOUT materials (calculatePrice: false)
        const calcResp = await axios.post(`${API_URL}/calculations`, {
          roomName: currentRoom.name,
          roomLength: parseFloat(currentRoom.length),
          roomWidth: parseFloat(currentRoom.width),
          projectId: pId,
          calculatePrice: false, // Don't calculate materials yet
        });

        // Add room to local state
        const roomBasicInfo = {
          id: calcResp.data.id,
          roomName: calcResp.data.roomName,
          roomLength: calcResp.data.roomLength,
          roomWidth: calcResp.data.roomWidth,
          roomArea: calcResp.data.roomArea,
          pipeLengthWithReserve: calcResp.data.pipeLengthWithReserve,
        };
        setRooms([...rooms, roomBasicInfo]);
        setCurrentRoom({ name: '', length: '', width: '' });
        showNotification('Комната добавлена успешно!', 'success');
      } catch (error) {
        console.error('Error adding room:', error);
        showNotification('Ошибка при добавлении комнаты', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCalculateAll = async () => {
    if (!projectId || rooms.length === 0) return;

    try {
      setCalculating(true);

      // Update each calculation with calculatePrice: true
      for (const room of rooms) {
        await axios.put(`${API_URL}/calculations/${room.id}`, {
          roomName: room.roomName,
          roomLength: room.roomLength,
          roomWidth: room.roomWidth,
          calculatePrice: true,
        });
      }

      // Load summary after all calculations
      await loadSummary(projectId);
      showNotification('Расчет материалов завершен!', 'success');
    } catch (error) {
      console.error('Error calculating:', error);
      showNotification('Ошибка при расчете материалов', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!projectId) {
      showNotification('Avval xonalarni hisoblang', 'warning');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/summary/pdf`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${projectName}_summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('PDF muvaffaqiyatli yuklandi!', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('PDF yuklashda xatolik', 'error');
    }
  };

  const handleUpdateProjectName = async () => {
    if (!projectId || !projectName.trim()) return;

    try {
      await axios.put(`${API_URL}/projects/${projectId}`, {
        name: projectName,
        status: 'DRAFT',
      });
      showNotification('Project nomi o\'zgartirildi!', 'success');
    } catch (error) {
      console.error('Error updating project name:', error);
      showNotification('Project nomini o\'zgartirishda xatolik', 'error');
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    try {
      await axios.delete(`${API_URL}/projects/${projectId}`);
      setDeleteProjectDialog(false);
      showNotification('Project o\'chirildi!', 'success');
      // Reset state
      setProjectId(null);
      setRooms([]);
      setSummary(null);

      // Fetch next project number
      try {
        const response = await axios.get(`${API_URL}/projects`);
        const projects = response.data;
        let maxNumber = 0;
        projects.forEach(project => {
          const match = project.name.match(/Проект #(\d+)/);
          if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) {
              maxNumber = num;
            }
          }
        });
        setProjectName(`Проект #${maxNumber + 1}`);
      } catch (error) {
        setProjectName('Проект #1');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification('Project o\'chirishda xatolik', 'error');
    }
  };

  const handleEditRoom = (room) => {
    setEditDialog({
      open: true,
      room: { ...room },
    });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.room) return;

    try {
      setLoading(true);
      const updatedRoom = editDialog.room;

      // Update calculation (without recalculating materials)
      const calcResp = await axios.put(`${API_URL}/calculations/${updatedRoom.id}`, {
        roomName: updatedRoom.roomName,
        roomLength: parseFloat(updatedRoom.roomLength),
        roomWidth: parseFloat(updatedRoom.roomWidth),
        calculatePrice: false,
      });

      // Update local state
      const updatedRooms = rooms.map((r) =>
        r.id === updatedRoom.id
          ? {
              id: calcResp.data.id,
              roomName: calcResp.data.roomName,
              roomLength: calcResp.data.roomLength,
              roomWidth: calcResp.data.roomWidth,
              roomArea: calcResp.data.roomArea,
              pipeLengthWithReserve: calcResp.data.pipeLengthWithReserve,
            }
          : r
      );
      setRooms(updatedRooms);
      setEditDialog({ open: false, room: null });
      showNotification('Комната обновлена успешно!', 'success');
    } catch (error) {
      console.error('Error updating room:', error);
      showNotification('Ошибка при обновлении комнаты', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = (room) => {
    setDeleteDialog({ open: true, roomId: room.id, roomName: room.roomName });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/calculations/${deleteDialog.roomId}`);
      setRooms(rooms.filter((r) => r.id !== deleteDialog.roomId));
      setDeleteDialog({ open: false, roomId: null, roomName: '' });
      if (projectId) {
        loadSummaryDebounced(projectId);
      }
      showNotification('Комната удалена успешно!', 'success');
    } catch (error) {
      console.error('Error deleting room:', error);
      showNotification('Ошибка при удалении комнаты', 'error');
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '16px' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', flexGrow: 1 }}>
            Расчет для всего дома
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleDownloadPdf}
            disabled={!summary || summary.totalMaterials?.length === 0}
          >
            PDF
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteProjectDialog(true)}
            disabled={!projectId}
          >
            O'chirish
          </Button>
        </Box>

        {/* Project Name */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Название проекта"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={handleUpdateProjectName}
            variant="outlined"
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
                    <React.Fragment key={room.id}>
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
                            onClick={() => handleEditRoom(room)}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteRoom(room)}
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

          {/* Right Column - Materials or Calculate Button */}
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
                  {rooms.length > 0 ? 'Нажмите "Рассчитать"' : 'Добавьте комнаты'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {rooms.length > 0
                    ? 'Чтобы рассчитать необходимые материалы для всех комнат'
                    : 'Начните добавлять комнаты слева для расчета материалов'}
                </Typography>
                {rooms.length > 0 && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={calculating ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                    onClick={handleCalculateAll}
                    disabled={calculating}
                    sx={{ py: 2, px: 6 }}
                  >
                    {calculating ? 'Расчет...' : 'Рассчитать материалы'}
                  </Button>
                )}
              </Paper>
            )}

            {/* Calculate Button at Bottom (if materials exist) */}
            {summary && summary.totalMaterials && summary.totalMaterials.length > 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={calculating ? <CircularProgress size={20} /> : <CalculateIcon />}
                  onClick={handleCalculateAll}
                  disabled={calculating}
                  sx={{ py: 1.5, px: 4 }}
                >
                  {calculating ? 'Пересчитываю...' : 'Пересчитать материалы'}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Edit Room Dialog */}
        <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, room: null })} maxWidth="sm" fullWidth>
          <DialogTitle>Редактировать комнату</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Название комнаты"
                value={editDialog.room?.roomName || ''}
                onChange={(e) => setEditDialog({ ...editDialog, room: { ...editDialog.room, roomName: e.target.value } })}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Длина (м)"
                    value={editDialog.room?.roomLength || ''}
                    onChange={(e) => setEditDialog({ ...editDialog, room: { ...editDialog.room, roomLength: e.target.value } })}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ширина (м)"
                    value={editDialog.room?.roomWidth || ''}
                    onChange={(e) => setEditDialog({ ...editDialog, room: { ...editDialog.room, roomWidth: e.target.value } })}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                </Grid>
              </Grid>
              {editDialog.room?.roomLength && editDialog.room?.roomWidth && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Площадь: <strong>{(parseFloat(editDialog.room.roomLength) * parseFloat(editDialog.room.roomWidth)).toFixed(2)} м²</strong>
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, room: null })}>Отмена</Button>
            <Button onClick={handleSaveEdit} variant="contained" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, roomId: null, roomName: '' })} maxWidth="xs" fullWidth>
          <DialogTitle>Удалить комнату?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить комнату <strong>"{deleteDialog.roomName}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, roomId: null, roomName: '' })}>
              Отмена
            </Button>
            <Button onClick={confirmDelete} variant="contained" color="error">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Project Dialog */}
        <Dialog
          open={deleteProjectDialog}
          onClose={() => setDeleteProjectDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Project'ni o'chirish?</DialogTitle>
          <DialogContent>
            <Typography>
              Project <strong>"{projectName}"</strong> ni o'chirishni xohlaysizmi?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Barcha xonalar va hisob-kitoblar ham o'chadi. Bu amalni qaytarib bo'lmaydi.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteProjectDialog(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleDeleteProject} variant="contained" color="error">
              O'chirish
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default MultiRoomCalculator;
