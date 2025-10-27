import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  TextField,
  Chip,
  CircularProgress,
  TablePagination,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../features/images/logo.png';

const API_URL = 'http://localhost:8080/api';

const ProjectRow = ({ project, calculations, onDelete, onDownloadPdf, onEdit }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalArea = calculations.reduce((sum, calc) => sum + (calc.roomArea || 0), 0);
  const roomCount = calculations.length;
  const calculatedRooms = calculations.filter((c) => c.materialItems?.length > 0).length;

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{project.name}</TableCell>
        <TableCell>{roomCount} комнат</TableCell>
        <TableCell>{totalArea.toFixed(2)} м²</TableCell>
        <TableCell>
          <Chip
            label={calculatedRooms === roomCount ? 'Завершено' : `${calculatedRooms}/${roomCount}`}
            color={calculatedRooms === roomCount ? 'success' : 'warning'}
            size="small"
          />
        </TableCell>
        <TableCell>{formatDate(project.createdAt)}</TableCell>
        <TableCell align="right">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onDownloadPdf(project.id)}
            disabled={calculatedRooms === 0}
            title="Скачать PDF"
          >
            <PictureAsPdfIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="info"
            onClick={() => onEdit(project)}
            title="Изменить название"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(project)}
            title="Удалить проект"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Комнаты ({roomCount})
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Комната</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Размеры</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Площадь</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Труба</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Материалы</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculations.map((calc) => (
                    <TableRow key={calc.id}>
                      <TableCell sx={{ fontWeight: 500 }}>{calc.roomName}</TableCell>
                      <TableCell>
                        {calc.roomLength} × {calc.roomWidth} м
                      </TableCell>
                      <TableCell>{calc.roomArea?.toFixed(2)} м²</TableCell>
                      <TableCell>{calc.pipeLength?.toFixed(2)} м</TableCell>
                      <TableCell>
                        {calc.materialItems?.length > 0 ? (
                          <Chip label="Рассчитано" color="success" size="small" />
                        ) : (
                          <Chip label="Не рассчитано" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectCalculations, setProjectCalculations] = useState({});
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, projects]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      // Get all projects
      const projectsResponse = await axios.get(`${API_URL}/projects`);
      const projectsData = projectsResponse.data;

      // Get calculations for all projects
      const calculationsMap = {};
      for (const project of projectsData) {
        const calcResponse = await axios.get(`${API_URL}/calculations/project/${project.id}`);
        calculationsMap[project.id] = calcResponse.data;
      }

      // Sort projects by date descending (newest first)
      projectsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setProjects(projectsData);
      setProjectCalculations(calculationsMap);
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error('Error loading history:', error);
      showNotification('Ошибка при загрузке истории', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter((project) => {
      const projectMatches = project.name?.toLowerCase().includes(query);
      const calculations = projectCalculations[project.id] || [];
      const roomMatches = calculations.some((calc) =>
        calc.roomName?.toLowerCase().includes(query)
      );
      return projectMatches || roomMatches;
    });

    setFilteredProjects(filtered);
    setPage(0);
  };

  const handleEditProject = (project) => {
    // Navigate to multi-room calculator with project ID to edit
    navigate(`/multi-room?projectId=${project.id}`);
  };

  const handleDeleteProject = (project) => {
    setDeleteDialog({ open: true, project });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/projects/${deleteDialog.project.id}`);
      setDeleteDialog({ open: false, project: null });
      showNotification('Проект удален успешно!', 'success');
      loadHistory();
    } catch (error) {
      console.error('Error deleting project:', error);
      showNotification('Ошибка при удалении проекта', 'error');
    }
  };

  const handleDownloadPdf = async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/summary/pdf`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project_${projectId}_summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showNotification('PDF успешно загружен!', 'success');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Ошибка при загрузке PDF', 'error');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalCalculations = Object.values(projectCalculations).flat().length;
  const totalArea = Object.values(projectCalculations)
    .flat()
    .reduce((sum, calc) => sum + (calc.roomArea || 0), 0);
  const totalCalculatedRooms = Object.values(projectCalculations)
    .flat()
    .filter((calc) => calc.materialItems?.length > 0).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '16px' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', flexGrow: 1 }}>
            История расчетов
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Назад
          </Button>
        </Box>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Поиск по проекту или комнате..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Statistics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Проектов
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {projects.length}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Всего комнат
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
              {totalCalculations}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Рассчитано
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
              {totalCalculatedRooms}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Общая площадь
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {totalArea.toFixed(2)} м²
            </Typography>
          </Paper>
        </Box>

        {/* History Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white', width: 50 }} />
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                        Проект
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                        Комнаты
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                        Площадь
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                        Статус
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }}>
                        Дата
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: 'primary.main', color: 'white' }} align="right">
                        Действия
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedProjects.length > 0 ? (
                      paginatedProjects.map((project) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          calculations={projectCalculations[project.id] || []}
                          onDelete={handleDeleteProject}
                          onDownloadPdf={handleDownloadPdf}
                          onEdit={handleEditProject}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                          <Typography variant="body1" color="text.secondary">
                            {searchQuery ? 'Ничего не найдено' : 'История проектов пуста'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredProjects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
              />
            </>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, project: null })}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Удалить проект?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить проект <strong>"{deleteDialog.project?.name}"</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Все расчеты и материалы будут также удалены. Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, project: null })}>
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

export default History;
