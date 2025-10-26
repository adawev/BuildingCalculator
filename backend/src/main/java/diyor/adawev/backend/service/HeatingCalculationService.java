package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.entity.*;
import diyor.adawev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class HeatingCalculationService {
    private final CalculationRepository calculationRepository;
    private final ProjectRepository projectRepository;
    private final MaterialRepository materialRepository;

    @Transactional
    public CalculationResponse calculate(CalculationRequest request) {
        // Starting calculation for room

        // Project optional
        Project project = null;
        if (request.getProjectId() != null && request.getProjectId() > 0) {
            project = projectRepository.findById(request.getProjectId()).orElse(null);
        }

        // Input ma'lumotlar:
        Float roomLength = request.getRoomLength();
        Float roomWidth = request.getRoomWidth();

        // TODO: Sizning hisob-kitoblaringiz
        Float roomArea = roomLength * roomWidth;         // Xona maydoni (m²)
        Float pipeLength = roomArea * 5f;       // Shlanka uzunligi (m)


        // Calculation entity yaratish
        Calculation calculation = Calculation.builder()
                .project(project)
                .roomName(request.getRoomName())
                .roomLength(roomLength)
                .roomWidth(roomWidth)
                .roomArea(roomArea)
                .pipeLength(pipeLength)
                .build();

        // Materiallar hisobi (agar kerak bo'lsa)
        List<MaterialItemResponse> materialItems = new ArrayList<>();

        if (request.getCalculatePrice()) {
            List<Material> materials = materialRepository.findByIsAvailableTrue();

            Float pipeCount = pipeLength;
            Float kollektorCount = 1f;
            Float kollektorNameCount = (float) Math.ceil(pipeLength / 32f);
            Float penopleksCount = (float) Math.ceil(roomArea / 0.7f);
            Float kriplenieUnitazCount = kollektorCount * 2f;
            Float vtulkaCount = kollektorNameCount * 2f;
            Float utiplitel16Count = kollektorNameCount * 0.7f;
            Float skobaCount = roomArea * 30f;
            Float folgaCount = roomArea;
            Float penaCount = (float) Math.ceil(roomArea / 6f);
            Float pistoletPenaCount = 1f;
            Float chopikCount = roomArea;
            Float parashutCount = roomArea;
            Float demferniyLentaCount = 2f * (roomLength + roomWidth);


            for (Material material : materials) {
                Float quantity = 0f;
                String type = material.getType();

                // Type bo'yicha hisoblash
                if (type != null) {
                    if (type.contains("PIPE_16")) {
                        quantity = pipeCount;
                    } else if (type.contains("KOLLEKTOR")) {
                        quantity = kollektorCount;
                    } else if (type.contains("PENOPLEKS")) {
                        quantity = penopleksCount;
                    } else if (type.contains("KRIPLENIE_UNITAZ")) {
                        quantity = kriplenieUnitazCount;
                    } else if (type.contains("VTULKA")) {
                        quantity = vtulkaCount;
                    } else if (type.contains("UTIPLITEL_16")) {
                        quantity = utiplitel16Count;
                    } else if (type.contains("SKOBA")) {
                        quantity = skobaCount;
                    } else if (type.contains("FOLGA")) {
                        quantity = folgaCount;
                    } else if (type.contains("PENA")) {
                        quantity = penaCount;
                    } else if (type.contains("PISTOLET_PENA")) {
                        quantity = pistoletPenaCount;
                    } else if (type.contains("CHOPIK_640")) {
                        quantity = chopikCount;
                    } else if (type.contains("PARASHUT")) {
                        quantity = parashutCount;
                    } else if (type.contains("DEMFERNIY_LENTA")) {
                        quantity = demferniyLentaCount;
                    }
                }

                if (quantity > 0f) {
                    MaterialItem item = MaterialItem.builder()
                            .calculation(calculation)
                            .material(material)
                            .quantity(quantity)
                            .build();
                    calculation.getMaterialItems().add(item);

                    String displayName = material.getName();

                    if (type != null && type.toLowerCase().contains("kollektor")) {
                        displayName = material.getName() + " × " + kollektorNameCount;
                    }

                    materialItems.add(MaterialItemResponse.builder()
                            .id(material.getId())
                            .materialName(displayName)
                            .quantity(quantity)
                            .unit(material.getUnit())
                            .originalName(material.getName())
                            .type(material.getType())
                            .build());
                }
            }
        }
        calculation = calculationRepository.save(calculation);

        // Calculation completed

        return CalculationResponse.builder()
                .id(calculation.getId())
                .roomName(calculation.getRoomName())
                .roomLength(roomLength)
                .roomWidth(roomWidth)
                .roomArea(roomArea)
                .pipeLengthWithReserve(pipeLength)
                .materials(materialItems)
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
                .map(item -> {
                    String displayName = item.getMaterial().getName();
                    String type = item.getMaterial().getType();

                    // Agar kollektor bo'lsa
                    if (type != null && type.toLowerCase().contains("kollektor")) {
                        int count = item.getQuantity().intValue();
                        displayName = item.getMaterial().getName() + " × " + count;
                    }

                    return MaterialItemResponse.builder()
                            .id(item.getMaterial().getId())
                            .materialName(displayName)
                            .quantity(item.getQuantity())
                            .unit(item.getMaterial().getUnit())
                            .originalName(item.getMaterial().getName())
                            .type(item.getMaterial().getType())
                            .build();
                })
                .toList();

        return CalculationResponse.builder()
                .id(calculation.getId())
                .roomName(calculation.getRoomName())
                .roomLength(calculation.getRoomLength())
                .roomWidth(calculation.getRoomWidth())
                .roomArea(calculation.getRoomArea())
                .pipeLengthWithReserve(calculation.getPipeLength())
                .materials(materials)
                .build();
    }
}
