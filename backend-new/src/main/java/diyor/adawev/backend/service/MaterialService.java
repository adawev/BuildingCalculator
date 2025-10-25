package diyor.adawev.backend.service;

import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.entity.Material;
import diyor.adawev.backend.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public MaterialResponse createMaterial(Material material) {
        if (material.getIsAvailable() == null) {
            material.setIsAvailable(true);
        }
        Material saved = materialRepository.save(material);
        log.info("Material created: {} (ID: {})", saved.getNameUz(), saved.getId());
        return mapToResponse(saved);
    }

    @Transactional
    public MaterialResponse updateMaterial(Long id, Material material) {
        Material existing = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        existing.setNameUz(material.getNameUz());
        existing.setNameRu(material.getNameRu());
        existing.setType(material.getType());
        existing.setUnit(material.getUnit());
        existing.setIsAvailable(material.getIsAvailable());

        Material updated = materialRepository.save(existing);
        log.info("Material updated: {} (ID: {})", updated.getNameUz(), updated.getId());
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        // Soft delete
        material.setIsAvailable(false);
        materialRepository.save(material);
        log.info("Material deleted: {} (ID: {})", material.getNameUz(), id);
    }

    private MaterialResponse mapToResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .nameUz(material.getNameUz())
                .nameRu(material.getNameRu())
                .type(material.getType())
                .unit(material.getUnit())
                .isAvailable(material.getIsAvailable())
                .build();
    }
}
