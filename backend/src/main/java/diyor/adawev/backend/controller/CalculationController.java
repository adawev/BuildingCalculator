package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.CalculationRequest;
import diyor.adawev.backend.dto.CalculationResponse;
import diyor.adawev.backend.service.CalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calculations")
@RequiredArgsConstructor
public class CalculationController {
    private final CalculationService calculationService;

    @PostMapping
    public ResponseEntity<CalculationResponse> calculate(@RequestBody CalculationRequest request) {
        return ResponseEntity.ok(calculationService.calculate(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalculationResponse> getCalculation(@PathVariable Long id) {
        return ResponseEntity.ok(calculationService.getCalculation(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CalculationResponse>> getCalculationsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(calculationService.getCalculationsByProject(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalculationResponse> updateCalculation(@PathVariable Long id, @RequestBody CalculationRequest request) {
        return ResponseEntity.ok(calculationService.updateCalculation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalculation(@PathVariable Long id) {
        calculationService.deleteCalculation(id);
        return ResponseEntity.noContent().build();
    }
}
