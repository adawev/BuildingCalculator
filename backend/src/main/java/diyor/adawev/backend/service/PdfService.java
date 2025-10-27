package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.CalculationResponse;
import diyor.adawev.backend.dto.MaterialItemResponse;
import diyor.adawev.backend.dto.MaterialSummary;
import diyor.adawev.backend.dto.ProjectSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfService {
    private final ProjectService projectService;

    public byte[] generateProjectSummaryPdf(Long projectId) throws IOException {
        ProjectSummaryResponse summary = projectService.getProjectSummary(projectId);

        try (PDDocument document = new PDDocument()) {
            // Load fonts that support Cyrillic characters
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/DejaVuSans.ttf");
            InputStream boldFontStream = getClass().getClassLoader().getResourceAsStream("fonts/DejaVuSans-Bold.ttf");

            PDType0Font font;
            PDType0Font boldFont;

            if (fontStream != null) {
                font = PDType0Font.load(document, fontStream);
                fontStream.close();
                if (boldFontStream != null) {
                    boldFont = PDType0Font.load(document, boldFontStream);
                    boldFontStream.close();
                } else {
                    boldFont = font;
                }
            } else {
                throw new IOException("Font files not found. Please add DejaVu fonts to resources/fonts/");
            }

            // Load logo
            PDImageXObject logo = null;
            try {
                InputStream logoStream = getClass().getClassLoader().getResourceAsStream("logo.png");
                if (logoStream != null) {
                    logo = PDImageXObject.createFromByteArray(document, logoStream.readAllBytes(), "logo");
                    logoStream.close();
                }
            } catch (Exception e) {
                System.out.println("Logo not found, continuing without logo");
            }

            // Create first page
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            float margin = 50;
            float yStart = page.getMediaBox().getHeight() - margin;
            float yPosition = yStart;
            float pageWidth = page.getMediaBox().getWidth();
            float contentWidth = pageWidth - 2 * margin;

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Draw logo if available
            if (logo != null) {
                float logoHeight = 40;
                float logoWidth = logo.getWidth() * (logoHeight / logo.getHeight());
                contentStream.drawImage(logo, margin, yPosition - logoHeight, logoWidth, logoHeight);
                yPosition -= logoHeight + 10;
            }

            // Title
            contentStream.setFont(boldFont, 20);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Отчет по проекту");
            contentStream.endText();
            yPosition -= 30;

            // Project info box
            drawBox(contentStream, margin, yPosition - 80, contentWidth, 75, new Color(240, 248, 255));

            contentStream.setFont(boldFont, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin + 10, yPosition - 15);
            contentStream.showText("Проект: " + (summary.getProjectName() != null ? summary.getProjectName() : ""));
            contentStream.endText();
            yPosition -= 25;

            contentStream.setFont(font, 11);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin + 10, yPosition - 5);
            contentStream.showText("Дата создания: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
            contentStream.endText();
            yPosition -= 20;

            contentStream.beginText();
            contentStream.newLineAtOffset(margin + 10, yPosition - 5);
            contentStream.showText("Всего комнат: " + summary.getRoomCount() +
                                 " | Общая площадь: " + String.format("%.2f м²", summary.getTotalArea()) +
                                 " | Длина трубы: " + String.format("%.2f м", summary.getTotalPipeLength()));
            contentStream.endText();
            yPosition -= 50;

            // Summary statistics
            contentStream.setFont(boldFont, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Общая сводка материалов");
            contentStream.endText();
            yPosition -= 20;

            // Materials table header
            drawTableHeader(contentStream, font, boldFont, margin, yPosition, contentWidth);
            yPosition -= 25;

            // Materials table rows
            contentStream.setFont(font, 9);
            for (MaterialSummary material : summary.getTotalMaterials()) {
                if (yPosition < margin + 50) {
                    contentStream.close();
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = yStart;
                    drawTableHeader(contentStream, font, boldFont, margin, yPosition, contentWidth);
                    yPosition -= 25;
                    contentStream.setFont(font, 9);
                }

                drawMaterialRow(contentStream, margin, yPosition, contentWidth, material);
                yPosition -= 20;
            }

            yPosition -= 20;

            // Detailed room information
            contentStream.setFont(boldFont, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Детальная информация по комнатам");
            contentStream.endText();
            yPosition -= 25;

            // Get detailed calculations for each room
            for (CalculationResponse calc : summary.getCalculations()) {
                if (yPosition < margin + 100) {
                    contentStream.close();
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = yStart;
                }

                // Room header box
                drawBox(contentStream, margin, yPosition - 50, contentWidth, 45, new Color(245, 245, 245));

                contentStream.setFont(boldFont, 12);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin + 10, yPosition - 15);
                contentStream.showText("Комната: " + calc.getRoomName());
                contentStream.endText();
                yPosition -= 25;

                contentStream.setFont(font, 10);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin + 10, yPosition - 5);
                contentStream.showText(String.format("Размеры: %.2f × %.2f м | Площадь: %.2f м² | Длина трубы: %.2f м",
                    calc.getRoomLength(), calc.getRoomWidth(), calc.getRoomArea(), calc.getPipeLength()));
                contentStream.endText();
                yPosition -= 35;

                // Room materials
                if (calc.getMaterialItems() != null && !calc.getMaterialItems().isEmpty()) {
                    contentStream.setFont(boldFont, 10);
                    contentStream.beginText();
                    contentStream.newLineAtOffset(margin + 10, yPosition);
                    contentStream.showText("Материалы:");
                    contentStream.endText();
                    yPosition -= 15;

                    contentStream.setFont(font, 9);
                    for (MaterialItemResponse item : calc.getMaterialItems()) {
                        if (yPosition < margin + 30) {
                            contentStream.close();
                            page = new PDPage(PDRectangle.A4);
                            document.addPage(page);
                            contentStream = new PDPageContentStream(document, page);
                            yPosition = yStart;
                            contentStream.setFont(font, 9);
                        }

                        contentStream.beginText();
                        contentStream.newLineAtOffset(margin + 20, yPosition);
                        contentStream.showText("• " + item.getMaterialName() +
                                             ": " + String.format("%.2f", item.getQuantity()) +
                                             " " + item.getUnit());
                        contentStream.endText();
                        yPosition -= 15;
                    }
                } else {
                    contentStream.setFont(font, 10);
                    contentStream.setNonStrokingColor(Color.GRAY);
                    contentStream.beginText();
                    contentStream.newLineAtOffset(margin + 10, yPosition);
                    contentStream.showText("(материалы не рассчитаны)");
                    contentStream.endText();
                    contentStream.setNonStrokingColor(Color.BLACK);
                    yPosition -= 15;
                }

                yPosition -= 15;
            }

            // Footer
            contentStream.setFont(font, 8);
            contentStream.setNonStrokingColor(Color.GRAY);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, 30);
            contentStream.showText("Сгенерировано: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss")));
            contentStream.endText();
            contentStream.setNonStrokingColor(Color.BLACK);

            contentStream.close();

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        }
    }

    private void drawBox(PDPageContentStream contentStream, float x, float y, float width, float height, Color color) throws IOException {
        contentStream.setNonStrokingColor(color);
        contentStream.addRect(x, y, width, height);
        contentStream.fill();
        contentStream.setNonStrokingColor(Color.BLACK);
        contentStream.setStrokingColor(new Color(200, 200, 200));
        contentStream.addRect(x, y, width, height);
        contentStream.stroke();
        contentStream.setStrokingColor(Color.BLACK);
    }

    private void drawTableHeader(PDPageContentStream contentStream, PDType0Font font, PDType0Font boldFont,
                                 float margin, float yPosition, float contentWidth) throws IOException {
        // Header background
        drawBox(contentStream, margin, yPosition - 20, contentWidth, 20, new Color(70, 130, 180));

        contentStream.setNonStrokingColor(Color.WHITE);
        contentStream.setFont(boldFont, 10);

        float col1 = margin + 5;
        float col2 = margin + contentWidth * 0.5f;
        float col3 = margin + contentWidth * 0.7f;
        float col4 = margin + contentWidth * 0.85f;

        contentStream.beginText();
        contentStream.newLineAtOffset(col1, yPosition - 15);
        contentStream.showText("Материал");
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col2, yPosition - 15);
        contentStream.showText("Тип");
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col3, yPosition - 15);
        contentStream.showText("Количество");
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col4, yPosition - 15);
        contentStream.showText("Ед. изм.");
        contentStream.endText();

        contentStream.setNonStrokingColor(Color.BLACK);
    }

    private void drawMaterialRow(PDPageContentStream contentStream, float margin, float yPosition,
                                 float contentWidth, MaterialSummary material) throws IOException {
        // Alternating row colors
        drawBox(contentStream, margin, yPosition - 15, contentWidth, 15, new Color(250, 250, 250));

        float col1 = margin + 5;
        float col2 = margin + contentWidth * 0.5f;
        float col3 = margin + contentWidth * 0.7f;
        float col4 = margin + contentWidth * 0.85f;

        String name = material.getMaterialName() != null ? material.getMaterialName() : "";
        if (name.length() > 40) {
            name = name.substring(0, 37) + "...";
        }

        contentStream.beginText();
        contentStream.newLineAtOffset(col1, yPosition - 10);
        contentStream.showText(name);
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col2, yPosition - 10);
        contentStream.showText(material.getType() != null ? material.getType() : "");
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col3, yPosition - 10);
        contentStream.showText(String.format("%.2f", material.getQuantity()));
        contentStream.endText();

        contentStream.beginText();
        contentStream.newLineAtOffset(col4, yPosition - 10);
        contentStream.showText(material.getUnit() != null ? material.getUnit() : "");
        contentStream.endText();
    }
}
