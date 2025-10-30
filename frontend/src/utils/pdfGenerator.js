import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../features/images/logo.png';

export const generatePDF = (calculation) => {
  const doc = new jsPDF();

  // Set default font to Helvetica (sans-serif)
  doc.setFont('helvetica');

  // Colors
  const primaryColor = [102, 126, 234]; // #667eea
  const darkGray = [51, 51, 51];
  const lightGray = [245, 245, 245];
  const textGray = [107, 114, 128];

  // Header with gradient background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 50, 'F');

  // Add logo to PDF (centered at top, bigger size)
  const img = new Image();
  img.src = logo;
  doc.addImage(img, 'PNG', 75, 5, 60, 30);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Tyopliy Pol Kalkulyator', 105, 38, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Калькулятор теплых полов', 105, 44, { align: 'center' });
  doc.text(new Date().toLocaleDateString('uz-UZ'), 105, 48, { align: 'center' });

  // Reset text color
  doc.setTextColor(...darkGray);

  // Project Info Box
  let yPos = 60;
  doc.setFillColor(...lightGray);
  doc.roundedRect(15, yPos, 180, 35, 3, 3, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Xona ma\'lumotlari / Информация о комнате', 20, yPos + 8);

  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Xona: ${calculation.roomName || 'N/A'}`, 20, yPos);
  yPos += 7;
  doc.text(`O'lchamlari / Размеры: ${calculation.roomLength} × ${calculation.roomWidth} m`, 20, yPos);
  yPos += 7;
  doc.text(`Maydon / Площадь: ${calculation.roomArea} m²`, 20, yPos);
  doc.text(`Oraliq / Расстояние: ${calculation.pipeSpacing} sm`, 120, yPos);

  // Calculation Results Box
  yPos += 15;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, yPos, 180, 40, 3, 3, 'FD');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Hisoblash natijalari / Результаты расчета', 20, yPos + 8);

  doc.setTextColor(...darkGray);
  yPos += 18;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Two columns for results
  doc.text(`Shlanka uzunligi / Длина трубы:`, 20, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculation.pipeLengthWithReserve} m`, 90, yPos);

  doc.setFont('helvetica', 'normal');
  doc.text(`Halqalar soni / Количество петель:`, 120, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculation.numberOfLoops}`, 175, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Quvvat / Мощность:`, 20, yPos);
  doc.setFont('helvetica', 'bold');
  doc.text(`${calculation.heatOutput} W`, 90, yPos);

  // Materials Table
  yPos += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Kerakli materiallar / Необходимые материалы', 20, yPos);

  yPos += 5;

  // Prepare table data
  const tableData = calculation.materials?.map((item) => [
    `${item.materialNameUz}\n${item.materialNameRu}`,
    `${item.quantity} ${item.unit}`,
    calculation.totalCost > 0 ? `${item.unitPrice?.toFixed(0) || '0'} so'm` : '-',
    calculation.totalCost > 0 ? `${item.totalPrice?.toFixed(0) || '0'} so'm` : '-',
  ]) || [];

  // Create table headers based on whether price is calculated
  const headers = calculation.totalCost > 0
    ? [['Material / Материал', 'Miqdor / Количество', 'Narx / Цена', 'Jami / Итого']]
    : [['Material / Материал', 'Miqdor / Количество']];

  // Adjust column widths based on price calculation
  const columnStyles = calculation.totalCost > 0
    ? { 0: { cellWidth: 70 }, 1: { cellWidth: 45 }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 } }
    : { 0: { cellWidth: 110 }, 1: { cellWidth: 75 } };

  doc.autoTable({
    startY: yPos,
    head: headers,
    body: calculation.totalCost > 0 ? tableData : tableData.map(row => [row[0], row[1]]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkGray,
    },
    columnStyles: columnStyles,
    alternateRowStyles: {
      fillColor: lightGray,
    },
    margin: { left: 15, right: 15 },
  });

  // Total Cost
  if (calculation.totalCost > 0) {
    yPos = doc.lastAutoTable.finalY + 5;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, yPos, 180, 15, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Jami narx / Общая стоимость:', 20, yPos + 10);
    doc.text(`${calculation.totalCost?.toFixed(0) || '0'} so'm`, 175, yPos + 10, { align: 'right' });
  }

  // Footer
  doc.setTextColor(...textGray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerY = doc.internal.pageSize.height - 15;
  doc.text('Tyopliy Pol Kalkulyator - Professional Heating Calculator', 105, footerY, { align: 'center' });
  doc.text(`Yaratilgan / Создано: ${new Date().toLocaleString('uz-UZ')}`, 105, footerY + 5, { align: 'center' });

  // Save
  const fileName = `tyopliy_pol_${calculation.roomName?.replace(/\s+/g, '_') || 'xona'}_${Date.now()}.pdf`;
  doc.save(fileName);
};
