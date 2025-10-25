package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.entity.Material;
import diyor.adawev.backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaterialService {
    private final MaterialRepository materialRepository;

    public List<MaterialResponse> getAllMaterials() {
        return materialRepository.findByIsAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<MaterialResponse> getMaterialsByType(Material.MaterialType type) {
        return materialRepository.findByTypeAndIsAvailableTrue(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public MaterialResponse getMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        return mapToResponse(material);
    }

    private MaterialResponse mapToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .nameUz(material.getNameUz())
                .nameRu(material.getNameRu())
                .type(material.getType())
                .unit(material.getUnit())
                .pricePerUnit(material.getPricePerUnit())
                .isAvailable(material.getIsAvailable())
                .build();
    }
}
