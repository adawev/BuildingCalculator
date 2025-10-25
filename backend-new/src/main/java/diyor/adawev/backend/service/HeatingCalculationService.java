package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.entity.*;
import diyor.adawev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class HeatingCalculationService {
    private final CalculationRepository calculationRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;

    @Value("${calculation.defaults.loop-max-length-m:100}")
    private Double maxLoopLength;

    @Value("${calculation.defaults.heat-output-per-m2:100}")
    private Double heatOutputPerM2;

    @Transactional
    public CalculationResponse calculate(CalculationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        BigDecimal roomArea = calculateRoomArea(request.getRoomLength(), request.getRoomWidth());
        BigDecimal pipeLength = calculatePipeLength(roomArea, request.getPipeSpacing());
        Integer numberOfLoops = calculateNumberOfLoops(pipeLength);
        BigDecimal heatOutput = calculateHeatOutput(roomArea);

        Calculation calculation = Calculation.builder()
                .project(project)
                .roomName(request.getRoomName())
                .roomLength(request.getRoomLength())
                .roomWidth(request.getRoomWidth())
                .pipeSpacing(request.getPipeSpacing())
                .roomArea(roomArea)
                .pipeLength(pipeLength)
                .numberOfLoops(numberOfLoops)
                .heatOutput(heatOutput)
                .build();

        List<MaterialItemResponse> materialItems = new ArrayList<>();
        BigDecimal totalCost = BigDecimal.ZERO;

        if (request.getCalculatePrice()) {
            List<Material> materials = materialRepository.findByIsAvailableTrue();
            for (Material material : materials) {
                BigDecimal quantity = calculateMaterialQuantity(material, roomArea, pipeLength, numberOfLoops);
                if (quantity.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal unitPrice = material.getPricePerUnit() != null ? material.getPricePerUnit() : BigDecimal.ZERO;
                    BigDecimal itemTotal = quantity.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);

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

        return CalculationResponse.builder()
                .id(calculation.getId())
                .roomName(calculation.getRoomName())
                .roomLength(calculation.getRoomLength())
                .roomWidth(calculation.getRoomWidth())
                .pipeSpacing(calculation.getPipeSpacing())
                .roomArea(roomArea)
                .pipeLengthWithReserve(pipeLength)
                .numberOfLoops(numberOfLoops)
                .heatOutput(heatOutput)
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

    private BigDecimal calculateRoomArea(BigDecimal length, BigDecimal width) {
        return length.multiply(width).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculatePipeLength(BigDecimal area, BigDecimal spacing) {
        BigDecimal spacingM = spacing.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        BigDecimal base = area.divide(spacingM, 2, RoundingMode.HALF_UP);
        BigDecimal reserve = base.multiply(BigDecimal.valueOf(0.10));
        return base.add(reserve).setScale(2, RoundingMode.HALF_UP);
    }

    private Integer calculateNumberOfLoops(BigDecimal pipeLength) {
        return pipeLength.divide(BigDecimal.valueOf(maxLoopLength), 0, RoundingMode.UP).intValue();
    }

    private BigDecimal calculateHeatOutput(BigDecimal area) {
        return area.multiply(BigDecimal.valueOf(heatOutputPerM2)).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateMaterialQuantity(Material material, BigDecimal area, BigDecimal pipeLength, Integer loops) {
        return switch (material.getType()) {
            case PIPE -> pipeLength;
            case MANIFOLD -> BigDecimal.valueOf(loops);
            case INSULATION, BASE_MATERIAL -> area;
            case FITTING, VALVE -> BigDecimal.valueOf(loops * 2);
            default -> BigDecimal.ZERO;
        };
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
                .pipeSpacing(calculation.getPipeSpacing())
                .roomArea(calculation.getRoomArea())
                .pipeLengthWithReserve(calculation.getPipeLength())
                .numberOfLoops(calculation.getNumberOfLoops())
                .heatOutput(calculation.getHeatOutput())
                .materials(materials)
                .totalCost(calculation.getTotalCost())
                .build();
    }
}
