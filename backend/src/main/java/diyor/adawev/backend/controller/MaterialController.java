package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.entity.Material;
import diyor.adawev.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@Slf4j
public class MaterialController {
    private final MaterialService materialService;

    // Barcha materiallarni olish
    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        log.info("Fetching all available materials");
        List<MaterialResponse> materials = materialService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    // Material type bo'yicha olish
    @GetMapping("/type/{type}")
    public ResponseEntity<List<MaterialResponse>> getMaterialsByType(@PathVariable String type) {
        log.info("Fetching materials by type: {}", type);
        List<MaterialResponse> materials = materialService.getMaterialsByType(type);
        return ResponseEntity.ok(materials);
    }

    // Bitta materialni olish
    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> getMaterial(@PathVariable Long id) {
        log.info("Fetching material with id: {}", id);
        MaterialResponse material = materialService.getMaterial(id);
        return ResponseEntity.ok(material);
    }

    // Yangi material qo'shish
    @PostMapping
    public ResponseEntity<MaterialResponse> createMaterial(@RequestBody Material material) {
        log.info("Creating new material: {}", material.getName());
        MaterialResponse created = materialService.createMaterial(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Materialni yangilash
    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponse> updateMaterial(
            @PathVariable Long id,
            @RequestBody Material material) {
        log.info("Updating material with id: {}", id);
        MaterialResponse updated = materialService.updateMaterial(id, material);
        return ResponseEntity.ok(updated);
    }

    // Materialni o'chirish
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        log.info("Deleting material with id: {}", id);
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
