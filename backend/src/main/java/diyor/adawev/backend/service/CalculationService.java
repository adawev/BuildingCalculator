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
public class CalculationService {
    private final CalculationRepository calculationRepository;
    private final ProjectRepository projectRepository;
    private final MaterialService materialService;

    @Transactional
    public CalculationResponse calculate(CalculationRequest req) {
        float area = req.getRoomLength() * req.getRoomWidth();
        float pipeLength = area * 5f;

        Calculation calc = Calculation.builder()
                .project(getProject(req.getProjectId()))
                .roomName(req.getRoomName())
                .roomLength(req.getRoomLength())
                .roomWidth(req.getRoomWidth())
                .roomArea(area)
                .pipeLength(pipeLength)
                .build();

        List<MaterialItemResponse> materials = new ArrayList<>();
        if (req.getCalculatePrice() != null && req.getCalculatePrice()) {
            materials = calculateMaterials(calc, area, pipeLength);
        }

        calc = calculationRepository.save(calc);
        return toResponse(calc, materials);
    }

    public CalculationResponse getCalculation(Long id) {
        Calculation calc = calculationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Calculation not found"));
        return toResponse(calc, toMaterialResponses(calc.getMaterialItems(), calc.getPipeLength()));
    }

    public List<CalculationResponse> getCalculationsByProject(Long projectId) {
        return calculationRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(c -> toResponse(c, toMaterialResponses(c.getMaterialItems(), c.getPipeLength())))
                .toList();
    }

    private Project getProject(Long projectId) {
        return (projectId != null && projectId > 0)
                ? projectRepository.findById(projectId).orElse(null)
                : null;
    }

    private List<MaterialItemResponse> calculateMaterials(Calculation calc, float area, float pipeLength) {
        List<MaterialItemResponse> responses = new ArrayList<>();
        List<MaterialDTO> availableMaterials = materialService.getAvailableMaterials();

        float perimeter = (float) (2 * Math.sqrt(area) * 2);
        int totalPairs = (int) Math.ceil(pipeLength / 32f);
        KollektorInfo kollektorInfo = calculateKollektors(totalPairs);

        for (MaterialDTO material : availableMaterials) {
            MaterialItem item = calculateMaterialItem(calc, material, area, pipeLength, perimeter, kollektorInfo);
            if (item != null) {
                calc.getMaterialItems().add(item);
                responses.add(toMaterialResponse(item, kollektorInfo));
            }
        }

        return responses;
    }

    private MaterialItem calculateMaterialItem(Calculation calc, MaterialDTO material,
                                               float area, float pipeLength, float perimeter,
                                               KollektorInfo kollektorInfo) {
        String type = material.getType();
        Float quantity = null;

        switch (type) {
            case "PIPE_16" -> quantity = pipeLength;
            case "KOLLEKTOR" -> quantity = (float) kollektorInfo.firstCount;
            case "KOLLEKTOR2" -> quantity = (float) kollektorInfo.secondCount;
            case "PENOPLEKS" -> quantity = (float) Math.ceil(area / 0.7f);
            case "KRIPLENIE_UNITAZ" -> quantity = 2f;
            case "VTULKA" -> quantity = (float) Math.ceil(pipeLength / 32f) * 2;
            case "UTIPLITEL_16" -> quantity = (float) Math.ceil(pipeLength / 32f) * 0.7f;
            case "SKOBA" -> quantity = area * 30f;
            case "FOLGA" -> quantity = area;
            case "PENA" -> quantity = (float) Math.ceil(area / 6f);
            case "PISTOLET_PENA" -> quantity = 1f;
            case "CHOPIK_640" -> quantity = area;
            case "PARASHUT" -> quantity = area;
            case "DEMFERNIY_LENTA" -> quantity = perimeter;
        }

        if (quantity == null || quantity <= 0) {
            return null;
        }

        return MaterialItem.builder()
                .calculation(calc)
                .materialName(material.getName())
                .materialType(material.getType())
                .unit(material.getUnit())
                .quantity(quantity)
                .build();
    }

    private KollektorInfo calculateKollektors(int totalPairs) {
        KollektorInfo info = new KollektorInfo();

        if (totalPairs <= 12) {
            // Faqat bitta kollektor kerak
            info.firstSize = Math.max(totalPairs, 2); // Minimum 2talik
            info.firstCount = 1;
            info.secondSize = 0;
            info.secondCount = 0;
        } else {
            // Ikki kollektor kerak
            info.firstSize = 12;
            info.firstCount = totalPairs / 12; // Nechta 12talik kerak

            int remaining = totalPairs % 12;
            if (remaining > 0) {
                info.secondSize = Math.max(remaining, 2); // Qolgan uchun, minimum 2talik
                info.secondCount = 1;
            } else {
                info.secondSize = 0;
                info.secondCount = 0;
            }
        }

        return info;
    }

    private MaterialItemResponse toMaterialResponse(MaterialItem item, KollektorInfo kollektorInfo) {
        String displayName = item.getMaterialName();

        if ("KOLLEKTOR".equals(item.getMaterialType()) && kollektorInfo.firstCount > 0) {
            displayName = String.format("%s %dконтур ",
                item.getMaterialName(), kollektorInfo.firstSize);
        } else if ("KOLLEKTOR2".equals(item.getMaterialType()) && kollektorInfo.secondCount > 0) {
            displayName = String.format("%s %dконтур ",
                item.getMaterialName(), kollektorInfo.secondSize);
        }

        return MaterialItemResponse.builder()
                .materialName(displayName)
                .quantity(item.getQuantity())
                .unit(item.getUnit())
                .originalName(item.getMaterialName())
                .type(item.getMaterialType())
                .build();
    }

    private static class KollektorInfo {
        int firstSize;      // Birinchi kollektor o'lchami (chiqishlar soni)
        int firstCount;     // Birinchi kollektordan nechta
        int secondSize;     // Ikkinchi kollektor o'lchami
        int secondCount;    // Ikkinchi kollektordan nechta
    }

    private CalculationResponse toResponse(Calculation c, List<MaterialItemResponse> materials) {
        return CalculationResponse.builder()
                .id(c.getId())
                .roomName(c.getRoomName())
                .roomLength(c.getRoomLength())
                .roomWidth(c.getRoomWidth())
                .roomArea(c.getRoomArea())
                .pipeLengthWithReserve(c.getPipeLength())
                .materials(materials)
                .build();
    }

    private List<MaterialItemResponse> toMaterialResponses(List<MaterialItem> items, float pipeLength) {
        int totalPairs = (int) Math.ceil(pipeLength / 32f);
        KollektorInfo kollektorInfo = calculateKollektors(totalPairs);

        return items.stream()
                .map(i -> toMaterialResponse(i, kollektorInfo))
                .toList();
    }
}
