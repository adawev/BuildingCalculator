package com.underfloorheating.controller;

import com.underfloorheating.entity.Material;
import com.underfloorheating.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaterialController {

    private final MaterialRepository materialRepository;

    @GetMapping
    public ResponseEntity<List<Material>> getAllMaterials() {
        List<Material> materials = materialRepository.findByIsAvailable(true);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Material>> getMaterialsByType(@PathVariable Material.MaterialType type) {
        List<Material> materials = materialRepository.findByTypeAndIsAvailable(type, true);
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterial(@PathVariable Long id) {
        return materialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Material> createMaterial(@RequestBody Material material) {
        Material saved = materialRepository.save(material);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        return materialRepository.findById(id)
                .map(existing -> {
                    material.setId(id);
                    return ResponseEntity.ok(materialRepository.save(material));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
