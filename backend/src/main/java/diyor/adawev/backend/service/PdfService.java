package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.CalculationResponse;
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
            // Load fonts
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
                throw new IOException("Font files not found");
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
                // Continue without logo
            }

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            float margin = 50;
            float yPosition = page.getMediaBox().getHeight() - margin;
            float pageWidth = page.getMediaBox().getWidth();
            float contentWidth = pageWidth - 2 * margin;

            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            // Logo
            if (logo != null) {
                float logoHeight = 50;
                float logoWidth = logo.getWidth() * (logoHeight / logo.getHeight());
                float logoX = (pageWidth - logoWidth) / 2;
                contentStream.drawImage(logo, logoX, yPosition - logoHeight, logoWidth, logoHeight);
                yPosition -= logoHeight + 30;
            }

            // Project Title - Centered
            contentStream.setFont(boldFont, 24);
            String projectName = summary.getProjectName() != null ? summary.getProjectName() : "Проект";
            float titleWidth = boldFont.getStringWidth(projectName) / 1000 * 24;
            float titleX = (pageWidth - titleWidth) / 2;
            contentStream.beginText();
            contentStream.newLineAtOffset(titleX, yPosition);
            contentStream.showText(projectName);
            contentStream.endText();
            yPosition -= 40;

            // Date - Centered
            contentStream.setFont(font, 11);
            contentStream.setNonStrokingColor(new Color(100, 100, 100));
            String dateText = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
            float dateWidth = font.getStringWidth(dateText) / 1000 * 11;
            float dateX = (pageWidth - dateWidth) / 2;
            contentStream.beginText();
            contentStream.newLineAtOffset(dateX, yPosition);
            contentStream.showText(dateText);
            contentStream.endText();
            contentStream.setNonStrokingColor(Color.BLACK);
            yPosition -= 50;

            // Thin separator line
            contentStream.setStrokingColor(new Color(220, 220, 220));
            contentStream.setLineWidth(0.5f);
            contentStream.moveTo(margin, yPosition);
            contentStream.lineTo(pageWidth - margin, yPosition);
            contentStream.stroke();
            contentStream.setStrokingColor(Color.BLACK);
            yPosition -= 30;

            // Summary Stats - Clean Grid
            contentStream.setFont(font, 10);
            contentStream.setNonStrokingColor(new Color(100, 100, 100));

            float col1X = margin;
            float col2X = margin + contentWidth / 3;
            float col3X = margin + 2 * contentWidth / 3;

            // Labels
            contentStream.beginText();
            contentStream.newLineAtOffset(col1X, yPosition);
            contentStream.showText("Комнат");
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col2X, yPosition);
            contentStream.showText("Площадь");
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col3X, yPosition);
            contentStream.showText("Труба");
            contentStream.endText();
            yPosition -= 20;

            // Values
            contentStream.setFont(boldFont, 16);
            contentStream.setNonStrokingColor(Color.BLACK);

            contentStream.beginText();
            contentStream.newLineAtOffset(col1X, yPosition);
            contentStream.showText(String.valueOf(summary.getRoomCount()));
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col2X, yPosition);
            contentStream.showText(String.format("%.1f м²", summary.getTotalArea()));
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col3X, yPosition);
            contentStream.showText(String.format("%.1f м", summary.getTotalPipeLength()));
            contentStream.endText();
            yPosition -= 50;

            // Rooms Section
            contentStream.setFont(boldFont, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Комнаты");
            contentStream.endText();
            yPosition -= 25;

            contentStream.setFont(font, 10);
            for (CalculationResponse calc : summary.getCalculations()) {
                if (yPosition < margin + 50) {
                    contentStream.close();
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = page.getMediaBox().getHeight() - margin;
                    contentStream.setFont(font, 10);
                }

                // Room name and dimensions on one line
                String roomInfo = String.format("%s  •  %.1f × %.1f м  •  %.1f м²",
                    calc.getRoomName(),
                    calc.getRoomLength(),
                    calc.getRoomWidth(),
                    calc.getRoomArea());

                contentStream.beginText();
                contentStream.newLineAtOffset(margin + 10, yPosition);
                contentStream.showText(roomInfo);
                contentStream.endText();
                yPosition -= 20;
            }

            yPosition -= 20;

            // Materials Section
            contentStream.setFont(boldFont, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(margin, yPosition);
            contentStream.showText("Материалы");
            contentStream.endText();
            yPosition -= 30;

            // Table setup
            float tableWidth = contentWidth;
            float nameColWidth = tableWidth * 0.60f;
            float qtyColWidth = tableWidth * 0.25f;
            float unitColWidth = tableWidth * 0.15f;

            float col1X = margin;
            float col2X = margin + nameColWidth;
            float col3X = margin + nameColWidth + qtyColWidth;

            // Table header
            contentStream.setNonStrokingColor(new Color(240, 240, 240));
            contentStream.addRect(margin, yPosition - 20, tableWidth, 20);
            contentStream.fill();
            contentStream.setNonStrokingColor(Color.BLACK);

            contentStream.setFont(boldFont, 10);
            contentStream.beginText();
            contentStream.newLineAtOffset(col1X + 5, yPosition - 14);
            contentStream.showText("Название");
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col2X + 5, yPosition - 14);
            contentStream.showText("Количество");
            contentStream.endText();

            contentStream.beginText();
            contentStream.newLineAtOffset(col3X + 5, yPosition - 14);
            contentStream.showText("Ед.");
            contentStream.endText();

            yPosition -= 25;

            // Table rows
            contentStream.setFont(font, 10);
            boolean alternate = false;

            for (MaterialSummary material : summary.getTotalMaterials()) {
                if (yPosition < margin + 50) {
                    contentStream.close();
                    page = new PDPage(PDRectangle.A4);
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    yPosition = page.getMediaBox().getHeight() - margin;
                    alternate = false;
                    contentStream.setFont(font, 10);
                }

                // Alternate row background
                if (alternate) {
                    contentStream.setNonStrokingColor(new Color(250, 250, 250));
                    contentStream.addRect(margin, yPosition - 18, tableWidth, 18);
                    contentStream.fill();
                    contentStream.setNonStrokingColor(Color.BLACK);
                }
                alternate = !alternate;

                // Material name
                String name = material.getMaterialName();
                if (name.length() > 45) {
                    name = name.substring(0, 42) + "...";
                }
                contentStream.beginText();
                contentStream.newLineAtOffset(col1X + 5, yPosition - 12);
                contentStream.showText(name);
                contentStream.endText();

                // Quantity
                contentStream.beginText();
                contentStream.newLineAtOffset(col2X + 5, yPosition - 12);
                contentStream.showText(String.format("%.2f", material.getQuantity()));
                contentStream.endText();

                // Unit
                contentStream.beginText();
                contentStream.newLineAtOffset(col3X + 5, yPosition - 12);
                contentStream.showText(material.getUnit());
                contentStream.endText();

                yPosition -= 18;
            }

            // Table border
            contentStream.setStrokingColor(new Color(220, 220, 220));
            contentStream.setLineWidth(0.5f);

            // Vertical lines
            contentStream.moveTo(margin, yPosition);
            contentStream.lineTo(margin, yPosition + (summary.getTotalMaterials().size() * 18) + 25);
            contentStream.stroke();

            contentStream.moveTo(col2X, yPosition);
            contentStream.lineTo(col2X, yPosition + (summary.getTotalMaterials().size() * 18) + 25);
            contentStream.stroke();

            contentStream.moveTo(col3X, yPosition);
            contentStream.lineTo(col3X, yPosition + (summary.getTotalMaterials().size() * 18) + 25);
            contentStream.stroke();

            contentStream.moveTo(margin + tableWidth, yPosition);
            contentStream.lineTo(margin + tableWidth, yPosition + (summary.getTotalMaterials().size() * 18) + 25);
            contentStream.stroke();

            contentStream.close();

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        }
    }
}
