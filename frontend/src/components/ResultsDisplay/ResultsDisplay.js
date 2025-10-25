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
import { generatePDF } from '../../utils/pdfGenerator';

const ResultsDisplay = () => {
  const { current: calculation } = useSelector((state) => state.calculation);

  if (!calculation) {
    return (
      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" align="center">
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
            Результаты
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
          <Grid item xs={6} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Площадь</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.roomArea} м²</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', color: 'white', borderRadius: 1.5 }}>
              <Typography variant="caption">Труба</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{calculation.pipeLengthWithReserve} м</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Details */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Детали
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <Typography variant="caption" color="text.secondary">Комната:</Typography>
              <Typography variant="body2">{calculation.roomName || '-'}</Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography variant="caption" color="text.secondary">Размеры:</Typography>
              <Typography variant="body2">
                {calculation.roomLength} × {calculation.roomWidth} м
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Materials Table */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Необходимые материалы
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Материал</strong></TableCell>
                <TableCell align="right"><strong>Количество</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calculation.materials && calculation.materials.length > 0 ? (
                calculation.materials.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.materialName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.quantity} {item.unit}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Нет материалов для отображения
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
