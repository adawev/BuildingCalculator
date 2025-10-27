package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.MaterialSummary;
import diyor.adawev.backend.dto.ProjectSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PdfService {
    private final ProjectService projectService;

    private String toAscii(String text) {
        if (text == null) return "";
        // Replace Cyrillic and other non-ASCII characters with transliteration or remove them
        return text.replaceAll("[^\\x00-\\x7F]", "?");
    }

    public byte[] generateProjectSummaryPdf(Long projectId) throws IOException {
        ProjectSummaryResponse summary = projectService.getProjectSummary(projectId);

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                float margin = 50;
                float yStart = page.getMediaBox().getHeight() - margin;
                float yPosition = yStart;
                float tableWidth = page.getMediaBox().getWidth() - 2 * margin;

                // Use standard font that supports basic Latin characters
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);

                // Title
                String title = "Project Summary #" + projectId;
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText(title);
                contentStream.endText();
                yPosition -= 30;

                // Project info
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Project: " + toAscii(summary.getProjectName()));
                contentStream.endText();
                yPosition -= 20;

                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Date: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                contentStream.endText();
                yPosition -= 20;

                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Total Rooms: " + summary.getRoomCount());
                contentStream.endText();
                yPosition -= 20;

                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Total Area: " + String.format("%.2f", summary.getTotalArea()) + " m2");
                contentStream.endText();
                yPosition -= 20;

                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Total Pipe Length: " + String.format("%.2f", summary.getTotalPipeLength()) + " m");
                contentStream.endText();
                yPosition -= 30;

                // Materials header
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.beginText();
                contentStream.newLineAtOffset(margin, yPosition);
                contentStream.showText("Materials Summary");
                contentStream.endText();
                yPosition -= 25;

                // Table header
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
                float col1 = margin;
                float col2 = margin + 250;
                float col3 = margin + 350;
                float col4 = margin + 450;

                contentStream.beginText();
                contentStream.newLineAtOffset(col1, yPosition);
                contentStream.showText("Material Name");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(col2, yPosition);
                contentStream.showText("Type");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(col3, yPosition);
                contentStream.showText("Quantity");
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(col4, yPosition);
                contentStream.showText("Unit");
                contentStream.endText();

                yPosition -= 5;

                // Draw line under header
                contentStream.setLineWidth(1);
                contentStream.moveTo(margin, yPosition);
                contentStream.lineTo(margin + tableWidth, yPosition);
                contentStream.stroke();
                yPosition -= 15;

                // Table rows
                contentStream.setFont(PDType1Font.HELVETICA, 9);
                for (MaterialSummary material : summary.getTotalMaterials()) {
                    if (yPosition < margin + 50) {
                        // Need new page
                        contentStream.close();
                        page = new PDPage(PDRectangle.A4);
                        document.addPage(page);
                        PDPageContentStream newContentStream = new PDPageContentStream(document, page);
                        yPosition = yStart;
                        contentStream.close();
                        return generateProjectSummaryPdf(projectId); // Regenerate with proper pagination
                    }

                    // Truncate long names to fit
                    String name = toAscii(material.getMaterialName());
                    if (name.length() > 35) {
                        name = name.substring(0, 32) + "...";
                    }

                    contentStream.beginText();
                    contentStream.newLineAtOffset(col1, yPosition);
                    contentStream.showText(name);
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(col2, yPosition);
                    contentStream.showText(toAscii(material.getType()));
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(col3, yPosition);
                    contentStream.showText(String.format("%.2f", material.getQuantity()));
                    contentStream.endText();

                    contentStream.beginText();
                    contentStream.newLineAtOffset(col4, yPosition);
                    contentStream.showText(toAscii(material.getUnit()));
                    contentStream.endText();

                    yPosition -= 15;
                }
            }

            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            return byteArrayOutputStream.toByteArray();
        }
    }
}
