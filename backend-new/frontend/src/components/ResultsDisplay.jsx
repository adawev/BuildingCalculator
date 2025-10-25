import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { generatePDF } from '../utils/pdfGenerator';

const ResultsDisplay = () => {
  const { current: calculation } = useSelector((state) => state.calculation);

  if (!calculation) {
    return (
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
            Natijalarni ko'rish uchun ma'lumotlarni kiriting
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Введите данные для просмотра результатов
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleExportPDF = () => {
    generatePDF(calculation);
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Natijalar / Результаты
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            size="small"
          >
            PDF
          </Button>
        </Box>

        {/* Summary Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Maydon / Площадь</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.roomArea} m²</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Shlanka / Труба</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.pipeLengthWithReserve} m</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Halqalar / Петли</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.numberOfLoops}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Quvvat / Мощность</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.heatOutput} W</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Details */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Tafsilotlar / Детали
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" color="text.secondary">Xona / Комната:</Typography>
              <Typography variant="body2">{calculation.roomName || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" color="text.secondary">O'lchamlar / Размеры:</Typography>
              <Typography variant="body2">
                {calculation.roomLength} × {calculation.roomWidth} m
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography variant="caption" color="text.secondary">Oraliq / Расстояние:</Typography>
              <Typography variant="body2">{calculation.pipeSpacing} sm</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Materials Table */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Kerakli materiallar / Необходимые материалы
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Material / Материал</strong></TableCell>
                <TableCell align="right"><strong>Miqdor / Количество</strong></TableCell>
                {calculation.totalCost > 0 && (
                  <>
                    <TableCell align="right"><strong>Narx / Цена</strong></TableCell>
                    <TableCell align="right"><strong>Jami / Итого</strong></TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {calculation.materials?.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.materialNameUz}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.materialNameRu}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.quantity} {item.unit}
                    </Typography>
                  </TableCell>
                  {calculation.totalCost > 0 && (
                    <>
                      <TableCell align="right">
                        {item.unitPrice?.toFixed(0) || '0'} so'm
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.totalPrice?.toFixed(0) || '0'} so'm
                        </Typography>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {calculation.totalCost > 0 && (
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Jami narx / Общая стоимость:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      {calculation.totalCost?.toFixed(0) || '0'} so'm
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
