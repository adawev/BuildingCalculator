package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.*;
import diyor.adawev.backend.entity.*;
import diyor.adawev.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.http.client.AbstractHttpRequestFactoryProperties;
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
    private final AbstractHttpRequestFactoryProperties abstractHttpRequestFactoryProperties;

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

            BigDecimal pipeCount = pipeLength;
            BigDecimal kollektorCount = new BigDecimal("1");
            BigDecimal kollektorNameCount = pipeLength.divide(new BigDecimal("32"), 0, java.math.RoundingMode.UP);
            BigDecimal penopleksCount = roomArea.divide(new BigDecimal("0.7"), RoundingMode.HALF_UP);
            BigDecimal kriplenieUnitazCount = kollektorCount.multiply(new BigDecimal("2"));
            BigDecimal vtulkaCount = kollektorNameCount.multiply(new BigDecimal("2"));
            BigDecimal utiplitel16Count = kollektorNameCount.multiply(new BigDecimal("0.7"));
            BigDecimal skobaCount = roomArea.multiply(new BigDecimal("30"));
            BigDecimal folgaCount = roomArea;
            BigDecimal penaCount = roomArea.divide(new BigDecimal("6"), RoundingMode.UP);
            BigDecimal pistoletPenaCount = new BigDecimal("1");
            BigDecimal chopikCount = roomArea;
            BigDecimal parashutCount = roomArea;
            BigDecimal demferniyLentaCount = new BigDecimal("2").multiply(roomLength.multiply(roomWidth));


            for (Material material : materials) {
                BigDecimal quantity = BigDecimal.ZERO;
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

                if (quantity.compareTo(BigDecimal.ZERO) > 0) {
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

        log.info("Calculation completed. ID: {}", calculation.getId());

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
