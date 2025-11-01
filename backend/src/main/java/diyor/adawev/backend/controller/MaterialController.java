package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.MaterialRequest;
import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        List<MaterialResponse> materials = materialService.getAllMaterialsAsResponse();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> getMaterial(@PathVariable("id") Long id) {
        return ResponseEntity.ok(materialService.getMaterial(id));
    }

    @PostMapping
    public ResponseEntity<MaterialResponse> createMaterial(@RequestBody MaterialRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materialService.createMaterial(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponse> updateMaterial(@PathVariable("id") Long id, @RequestBody MaterialRequest request) {
        return ResponseEntity.ok(materialService.updateMaterial(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable("id") Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}

