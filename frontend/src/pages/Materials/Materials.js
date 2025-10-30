import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../features/images/logo.png';

const API_URL = 'http://localhost:8080/api';

const Materials = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, mode: 'add', material: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, materialId: null, materialName: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    unit: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error loading materials:', error);
      showNotification('Ошибка при загрузке материалов', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleOpenDialog = (mode, material = null) => {
    if (mode === 'edit' && material) {
      setFormData({
        name: material.name,
        type: material.type,
        unit: material.unit,
        isAvailable: material.isAvailable,
      });
    } else {
      setFormData({
        name: '',
        type: '',
        unit: '',
        isAvailable: true,
      });
    }
    setDialog({ open: true, mode, material });
  };

  const handleCloseDialog = () => {
    setDialog({ open: false, mode: 'add', material: null });
    setFormData({ name: '', type: '', unit: '', isAvailable: true });
  };

  const handleSave = async () => {
    try {
      if (dialog.mode === 'add') {
        await axios.post(`${API_URL}/materials`, formData);
        showNotification('Материал добавлен успешно!', 'success');
      } else if (dialog.mode === 'edit') {
        await axios.put(`${API_URL}/materials/${dialog.material.id}`, formData);
        showNotification('Материал обновлен успешно!', 'success');
      }
      handleCloseDialog();
      loadMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
      showNotification('Ошибка при сохранении материала', 'error');
    }
  };

  const handleDelete = (material) => {
    setDeleteDialog({ open: true, materialId: material.id, materialName: material.name });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/materials/${deleteDialog.materialId}`);
      setDeleteDialog({ open: false, materialId: null, materialName: '' });
      showNotification('Материал удален успешно!', 'success');
      loadMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      showNotification('Ошибка при удалении материала', 'error');
    }
  };

  const handleToggleAvailability = async (material) => {
    try {
      await axios.put(`${API_URL}/materials/${material.id}`, {
        ...material,
        isAvailable: !material.isAvailable,
      });
      showNotification('Статус материала изменен!', 'success');
      loadMaterials();
    } catch (error) {
      console.error('Error updating material:', error);
      showNotification('Ошибка при обновлении материала', 'error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <img src={logo} alt="Logo" style={{ height: '60px', marginRight: '16px' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', flexGrow: 1 }}>
            Управление материалами
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
            sx={{ px: 3 }}
          >
            Добавить материал
          </Button>
        </Box>

        {/* Materials Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                      Название
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                      Тип
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                      Единица
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                      Статус
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }} align="right">
                      Действия
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{material.name}</TableCell>
                      <TableCell>
                        <Chip label={material.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={material.isAvailable}
                              onChange={() => handleToggleAvailability(material)}
                              color="success"
                            />
                          }
                          label={material.isAvailable ? 'Активен' : 'Неактивен'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog('edit', material)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(material)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {materials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <Typography variant="body1" color="text.secondary">
                          Нет материалов
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Add/Edit Material Dialog */}
        <Dialog open={dialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {dialog.mode === 'add' ? 'Добавить материал' : 'Редактировать материал'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название материала"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Тип (латиницей, UPPERCASE)"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value.toUpperCase() })}
                  placeholder="PIPE_16"
                  required
                  disabled={dialog.mode === 'edit'}
                  helperText="Тип нельзя изменить после создания"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Единица измерения"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="м, шт, кг, м²"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      color="success"
                    />
                  }
                  label="Материал активен"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!formData.name || !formData.type || !formData.unit}
            >
              {dialog.mode === 'add' ? 'Добавить' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, materialId: null, materialName: '' })}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Удалить материал?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить материал <strong>"{deleteDialog.materialName}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, materialId: null, materialName: '' })}>
              Отмена
            </Button>
            <Button onClick={confirmDelete} variant="contained" color="error">
              Удалить
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

export default Materials;
