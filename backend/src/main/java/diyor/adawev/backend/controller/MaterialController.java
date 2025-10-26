package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.MaterialResponse;
import diyor.adawev.backend.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService materialService;

    // Barcha materiallarni olish (JSON fayldan)
    @GetMapping
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        List<MaterialResponse> materials = materialService.getAllMaterialsAsResponse();
        return ResponseEntity.ok(materials);
    }
}
