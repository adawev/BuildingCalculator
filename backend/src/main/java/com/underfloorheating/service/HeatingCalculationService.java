package com.underfloorheating.service;

import com.underfloorheating.dto.CalculationRequest;
import com.underfloorheating.dto.CalculationResponse;
import com.underfloorheating.dto.MaterialItemResponse;
import com.underfloorheating.entity.*;
import com.underfloorheating.repository.CalculationRepository;
import com.underfloorheating.repository.MaterialRepository;
import com.underfloorheating.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HeatingCalculationService {

    private final CalculationRepository calculationRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;

    private static final BigDecimal LOOP_MAX_LENGTH = new BigDecimal("100");
    private static final BigDecimal RESERVE_PERCENTAGE = new BigDecimal("0.10");
    private static final BigDecimal HEAT_OUTPUT_PER_SQM = new BigDecimal("100");
    private static final BigDecimal CM_TO_METER = new BigDecimal("100");

    @Transactional
    public CalculationResponse calculate(CalculationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        BigDecimal roomArea = request.getRoomLength()
                .multiply(request.getRoomWidth())
                .setScale(2, RoundingMode.HALF_UP);

        // Always use SPIRAL pattern as default
        BigDecimal pipeLengthCalculated = calculatePipeLength(
                roomArea,
                request.getPipeSpacing(),
                Calculation.InstallationPattern.SPIRAL
        );

        BigDecimal pipeLengthWithReserve = pipeLengthCalculated
                .multiply(BigDecimal.ONE.add(RESERVE_PERCENTAGE))
                .setScale(2, RoundingMode.HALF_UP);

        Integer numberOfLoops = calculateNumberOfLoops(pipeLengthWithReserve);

        BigDecimal heatOutput = roomArea
                .multiply(HEAT_OUTPUT_PER_SQM)
                .setScale(2, RoundingMode.HALF_UP);

        Calculation calculation = Calculation.builder()
                .project(project)
                .roomName(request.getRoomName())
                .roomLength(request.getRoomLength())
                .roomWidth(request.getRoomWidth())
                .roomArea(roomArea)
                .pipeSpacing(request.getPipeSpacing())
                .installationPattern(Calculation.InstallationPattern.SPIRAL)
                .pipeLengthCalculated(pipeLengthCalculated)
                .pipeLengthWithReserve(pipeLengthWithReserve)
                .numberOfLoops(numberOfLoops)
                .heatOutput(heatOutput)
                .materialItems(new ArrayList<>())
                .build();

        List<MaterialItem> materialItems = calculateMaterials(
                calculation,
                pipeLengthWithReserve,
                numberOfLoops,
                roomArea,
                request.getCalculatePrice()
        );
        calculation.setMaterialItems(materialItems);

        if (request.getCalculatePrice()) {
            BigDecimal totalCost = materialItems.stream()
                    .map(MaterialItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            calculation.setTotalCost(totalCost);
        }

        Calculation savedCalculation = calculationRepository.save(calculation);
        return convertToResponse(savedCalculation);
    }

    private BigDecimal calculatePipeLength(BigDecimal roomArea, BigDecimal pipeSpacingCm,
                                          Calculation.InstallationPattern pattern) {
        BigDecimal pipeSpacingM = pipeSpacingCm.divide(CM_TO_METER, 4, RoundingMode.HALF_UP);
        BigDecimal baseLength = roomArea.divide(pipeSpacingM, 2, RoundingMode.HALF_UP);

        BigDecimal patternMultiplier = switch (pattern) {
            case SPIRAL -> new BigDecimal("1.05");
            case SNAKE -> new BigDecimal("1.10");
            case DOUBLE_SNAKE -> new BigDecimal("1.15");
        };

        return baseLength.multiply(patternMultiplier).setScale(2, RoundingMode.HALF_UP);
    }

    private Integer calculateNumberOfLoops(BigDecimal totalLength) {
        return totalLength.divide(LOOP_MAX_LENGTH, 0, RoundingMode.UP).intValue();
    }

    private List<MaterialItem> calculateMaterials(Calculation calculation, BigDecimal pipeLength,
                                                  Integer numberOfLoops, BigDecimal roomArea,
                                                  Boolean calculatePrice) {
        List<MaterialItem> items = new ArrayList<>();

        Material pipe = findMaterialByType(Material.MaterialType.PIPE);
        if (pipe != null) {
            items.add(createMaterialItem(calculation, pipe, pipeLength, calculatePrice));
        }

        Material manifold = findMaterialByType(Material.MaterialType.MANIFOLD);
        if (manifold != null) {
            items.add(createMaterialItem(calculation, manifold, new BigDecimal(numberOfLoops), calculatePrice));
        }

        Material fittings = findMaterialByType(Material.MaterialType.FITTING);
        if (fittings != null) {
            BigDecimal fittingCount = new BigDecimal(numberOfLoops * 2);
            items.add(createMaterialItem(calculation, fittings, fittingCount, calculatePrice));
        }

        Material valve = findMaterialByType(Material.MaterialType.VALVE);
        if (valve != null) {
            BigDecimal valveCount = new BigDecimal(numberOfLoops * 2);
            items.add(createMaterialItem(calculation, valve, valveCount, calculatePrice));
        }

        Material insulation = findMaterialByType(Material.MaterialType.INSULATION);
        if (insulation != null) {
            BigDecimal insulationArea = roomArea.multiply(new BigDecimal("1.10"));
            items.add(createMaterialItem(calculation, insulation, insulationArea, calculatePrice));
        }

        Material baseMaterial = findMaterialByType(Material.MaterialType.BASE_MATERIAL);
        if (baseMaterial != null) {
            BigDecimal baseArea = roomArea.multiply(new BigDecimal("1.05"));
            items.add(createMaterialItem(calculation, baseMaterial, baseArea, calculatePrice));
        }

        return items;
    }

    private MaterialItem createMaterialItem(Calculation calculation, Material material,
                                           BigDecimal quantity, Boolean calculatePrice) {
        BigDecimal unitPrice = calculatePrice && material.getPricePerUnit() != null ?
                material.getPricePerUnit() : BigDecimal.ZERO;
        BigDecimal totalPrice = unitPrice.multiply(quantity).setScale(2, RoundingMode.HALF_UP);

        return MaterialItem.builder()
                .calculation(calculation)
                .material(material)
                .quantity(quantity.setScale(2, RoundingMode.HALF_UP))
                .unitPrice(unitPrice)
                .totalPrice(totalPrice)
                .build();
    }

    private Material findMaterialByType(Material.MaterialType type) {
        List<Material> materials = materialRepository.findByTypeAndIsAvailable(type, true);
        return materials.isEmpty() ? null : materials.get(0);
    }

    private CalculationResponse convertToResponse(Calculation calculation) {
        List<MaterialItemResponse> materialResponses = calculation.getMaterialItems().stream()
                .map(item -> MaterialItemResponse.builder()
                        .id(item.getId())
                        .materialNameUz(item.getMaterial().getNameUz())
                        .materialNameRu(item.getMaterial().getNameRu())
                        .materialType(item.getMaterial().getType().name())
                        .quantity(item.getQuantity())
                        .unit(item.getMaterial().getUnit())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .toList();

        return CalculationResponse.builder()
                .id(calculation.getId())
                .projectId(calculation.getProject().getId())
                .roomName(calculation.getRoomName())
                .roomLength(calculation.getRoomLength())
                .roomWidth(calculation.getRoomWidth())
                .roomArea(calculation.getRoomArea())
                .pipeSpacing(calculation.getPipeSpacing())
                .installationPattern(calculation.getInstallationPattern())
                .pipeLengthCalculated(calculation.getPipeLengthCalculated())
                .pipeLengthWithReserve(calculation.getPipeLengthWithReserve())
                .numberOfLoops(calculation.getNumberOfLoops())
                .heatOutput(calculation.getHeatOutput())
                .materials(materialResponses)
                .totalCost(calculation.getTotalCost())
                .createdAt(calculation.getCreatedAt())
                .build();
    }

    public CalculationResponse getCalculation(Long id) {
        Calculation calculation = calculationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calculation not found"));
        return convertToResponse(calculation);
    }

    public List<CalculationResponse> getProjectCalculations(Long projectId) {
        return calculationRepository.findByProjectId(projectId).stream()
                .map(this::convertToResponse)
                .toList();
    }
}
