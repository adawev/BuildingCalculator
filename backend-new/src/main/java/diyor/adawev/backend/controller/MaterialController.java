package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.entity.Material;
import diyor.adawev.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@Slf4j
public class MaterialController {
    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        log.info("Fetching all available materials");
        List<MaterialResponse> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<MaterialResponse>> getMaterialsByType(@PathVariable Material.MaterialType type) {
        log.info("Fetching materials by type: {}", type);
        List<MaterialResponse> materials = materialService.getMaterialsByType(type);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> getMaterial(@PathVariable Long id) {
        log.info("Fetching material with id: {}", id);
        MaterialResponse material = materialService.getMaterial(id);
        return ResponseEntity.ok(material);
    }
}
