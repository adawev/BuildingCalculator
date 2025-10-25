package diyor.adawev.backend.controller;

import diyor.adawev.backend.dto.CalculationRequest;
import diyor.adawev.backend.dto.CalculationResponse;
import diyor.adawev.backend.service.HeatingCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calculations")
@RequiredArgsConstructor
@Slf4j
public class CalculationController {
    private final HeatingCalculationService calculationService;

    @PostMapping
    public ResponseEntity<CalculationResponse> calculate(@RequestBody CalculationRequest request) {
        log.info("Calculating heating for room: {}", request.getRoomName());
        CalculationResponse response = calculationService.calculate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalculationResponse> getCalculation(@PathVariable Long id) {
        log.info("Fetching calculation with id: {}", id);
        CalculationResponse response = calculationService.getCalculation(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CalculationResponse>> getCalculationsByProject(@PathVariable Long projectId) {
        log.info("Fetching calculations for project: {}", projectId);
        List<CalculationResponse> responses = calculationService.getCalculationsByProject(projectId);
        return ResponseEntity.ok(responses);
    }
}
