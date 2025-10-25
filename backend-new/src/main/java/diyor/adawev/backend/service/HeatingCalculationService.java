package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.entity.*;
import diyor.adawev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class HeatingCalculationService {
    private final CalculationRepository calculationRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;

    @Transactional
    public CalculationResponse calculate(CalculationRequest request) {
        log.info("Starting calculation for room: {}", request.getRoomName());

        // Project optional
        Project project = null;
        if (request.getProjectId() != null && request.getProjectId() > 0) {
            project = projectRepository.findById(request.getProjectId()).orElse(null);
        }

        // Input ma'lumotlar:
        BigDecimal roomLength = request.getRoomLength();
        BigDecimal roomWidth = request.getRoomWidth();

        // TODO: Sizning hisob-kitoblaringiz
        BigDecimal roomArea = roomLength.multiply(roomWidth);         // Xona maydoni (m²)
        BigDecimal pipeLength = roomArea.multiply(new BigDecimal("5"));       // Shlanka uzunligi (m)

        // ==================================================================
        // BU JOYGA KERAKLI HISOB-KITOBLARNI QOSHING
        // ==================================================================

        // Calculation entity yaratish
        Calculation calculation = Calculation.builder()
                .project(project)
                .roomName(request.getRoomName())
                .roomLength(roomLength)
                .roomWidth(roomWidth)
                .roomArea(roomArea)
                .pipeLength(pipeLength)
                .totalCost(BigDecimal.ZERO)
                .build();

        // Materiallar hisobi (agar kerak bo'lsa)
        List<MaterialItemResponse> materialItems = new ArrayList<>();
        BigDecimal totalCost = BigDecimal.ZERO;

        if (request.getCalculatePrice()) {
            // Barcha mavjud materiallarni olish
            List<Material> materials = materialRepository.findByIsAvailableTrue();

            for (Material material : materials) {
                // TODO: Har bir material uchun kerakli miqdorni hisoblang
                BigDecimal quantity = BigDecimal.ZERO; // Sizning logikangiz

                if (quantity.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal unitPrice = material.getPricePerUnit() != null ?
                        material.getPricePerUnit() : BigDecimal.ZERO;
                    BigDecimal itemTotal = quantity.multiply(unitPrice);

                    MaterialItem item = MaterialItem.builder()
                            .calculation(calculation)
                            .material(material)
                            .quantity(quantity)
                            .unitPrice(unitPrice)
                            .totalPrice(itemTotal)
                            .build();
                    calculation.getMaterialItems().add(item);

                    materialItems.add(MaterialItemResponse.builder()
                            .id(material.getId())
                            .materialNameUz(material.getNameUz())
                            .materialNameRu(material.getNameRu())
                            .quantity(quantity)
                            .unit(material.getUnit())
                            .unitPrice(unitPrice)
                            .totalPrice(itemTotal)
                            .build());

                    totalCost = totalCost.add(itemTotal);
                }
            }
        }

        calculation.setTotalCost(totalCost);
        calculation = calculationRepository.save(calculation);

        log.info("Calculation completed. ID: {}", calculation.getId());

        return CalculationResponse.builder()
                .id(calculation.getId())
                .roomName(calculation.getRoomName())
                .roomLength(roomLength)
                .roomWidth(roomWidth)
                .roomArea(roomArea)
                .pipeLengthWithReserve(pipeLength)
                .materials(materialItems)
                .totalCost(totalCost)
                .build();
    }

    public CalculationResponse getCalculation(Long id) {
        Calculation calculation = calculationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calculation not found"));
        return mapToResponse(calculation);
    }

    public List<CalculationResponse> getCalculationsByProject(Long projectId) {
        return calculationRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream().map(this::mapToResponse).toList();
    }

    private CalculationResponse mapToResponse(Calculation calculation) {
        List<MaterialItemResponse> materials = calculation.getMaterialItems().stream()
                .map(item -> MaterialItemResponse.builder()
                        .id(item.getMaterial().getId())
                        .materialNameUz(item.getMaterial().getNameUz())
                        .materialNameRu(item.getMaterial().getNameRu())
                        .quantity(item.getQuantity())
                        .unit(item.getMaterial().getUnit())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .toList();

        return CalculationResponse.builder()
                .id(calculation.getId())
                .roomName(calculation.getRoomName())
                .roomLength(calculation.getRoomLength())
                .roomWidth(calculation.getRoomWidth())
                .roomArea(calculation.getRoomArea())
                .pipeLengthWithReserve(calculation.getPipeLength())
                .numberOfLoops(calculation.getNumberOfLoops())
                .heatOutput(calculation.getHeatOutput())
                .materials(materials)
                .totalCost(calculation.getTotalCost())
                .build();
    }
}
