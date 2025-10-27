package diyor.adawev.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import diyor.adawev.backend.dto.MaterialDTO;
import diyor.adawev.backend.dto.MaterialRequest;
import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.entity.Material;
import diyor.adawev.backend.repository.MaterialRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final ObjectMapper objectMapper;
    private final MaterialRepository materialRepository;

    @PostConstruct
    @Transactional
    public void initializeMaterialsFromJson() {
        // Initialize materials from JSON if database is empty
        if (materialRepository.count() == 0) {
            List<MaterialDTO> jsonMaterials = loadMaterialsFromJson();
            for (MaterialDTO dto : jsonMaterials) {
                Material material = Material.builder()
                        .name(dto.getName())
                        .type(dto.getType())
                        .unit(dto.getUnit())
                        .isAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : true)
                        .build();
                materialRepository.save(material);
            }
            System.out.println("Initialized " + jsonMaterials.size() + " materials from JSON");
        }
    }

    public List<MaterialDTO> getAllMaterials() {
        return materialRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MaterialDTO> getAvailableMaterials() {
        return materialRepository.findByIsAvailableTrue().stream()
                .map(this::toDTO)
                .toList();
    }

    public List<MaterialResponse> getAllMaterialsAsResponse() {
        return materialRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public MaterialResponse getMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        return toResponse(material);
    }

    @Transactional
    public MaterialResponse createMaterial(MaterialRequest request) {
        Material material = Material.builder()
                .name(request.getName())
                .type(request.getType())
                .unit(request.getUnit())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();
        material = materialRepository.save(material);
        return toResponse(material);
    }

    @Transactional
    public MaterialResponse updateMaterial(Long id, MaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (request.getName() != null) material.setName(request.getName());
        if (request.getType() != null) material.setType(request.getType());
        if (request.getUnit() != null) material.setUnit(request.getUnit());
        if (request.getIsAvailable() != null) material.setIsAvailable(request.getIsAvailable());

        material = materialRepository.save(material);
        return toResponse(material);
    }

    @Transactional
    public void deleteMaterial(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        materialRepository.delete(material);
    }

    private MaterialDTO toDTO(Material material) {
        return MaterialDTO.builder()
                .name(material.getName())
                .type(material.getType())
                .unit(material.getUnit())
                .isAvailable(material.getIsAvailable())
                .build();
    }

    private MaterialResponse toResponse(Material material) {
        return MaterialResponse.builder()
                .id(material.getId())
                .name(material.getName())
                .type(material.getType())
                .unit(material.getUnit())
                .isAvailable(material.getIsAvailable())
                .build();
    }

    private List<MaterialDTO> loadMaterialsFromJson() {
        try {
            ClassPathResource resource = new ClassPathResource("materials.json");
            try (InputStream inputStream = resource.getInputStream()) {
                return objectMapper.readValue(inputStream, new TypeReference<List<MaterialDTO>>() {});
            }
        } catch (IOException e) {
            System.err.println("Error loading materials: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}
