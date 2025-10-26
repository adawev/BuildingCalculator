package diyor.adawev.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import diyor.adawev.backend.dto.MaterialDTO;
import diyor.adawev.backend.dto.MaterialResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {
    private final ObjectMapper objectMapper;
    private List<MaterialDTO> cachedMaterials;

    public List<MaterialDTO> getAllMaterials() {
        if (cachedMaterials == null) {
            cachedMaterials = loadMaterialsFromJson();
        }
        return cachedMaterials;
    }

    public List<MaterialDTO> getAvailableMaterials() {
        return getAllMaterials().stream()
                .filter(m -> m.getIsAvailable() != null && m.getIsAvailable())
                .toList();
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

    public List<MaterialResponse> getAllMaterialsAsResponse() {
        return getAllMaterials().stream()
                .map(m -> MaterialResponse.builder()
                        .name(m.getName())
                        .type(m.getType())
                        .unit(m.getUnit())
                        .isAvailable(m.getIsAvailable())
                        .build())
                .toList();
    }
}
