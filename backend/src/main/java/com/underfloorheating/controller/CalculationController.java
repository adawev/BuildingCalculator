package com.underfloorheating.controller;

import com.underfloorheating.dto.CalculationRequest;
import com.underfloorheating.dto.CalculationResponse;
import com.underfloorheating.service.HeatingCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calculate")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CalculationController {

    private final HeatingCalculationService calculationService;

    @PostMapping
    public ResponseEntity<CalculationResponse> calculate(@Valid @RequestBody CalculationRequest request) {
        CalculationResponse response = calculationService.calculate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalculationResponse> getCalculation(@PathVariable Long id) {
        CalculationResponse response = calculationService.getCalculation(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<CalculationResponse>> getProjectCalculations(@PathVariable Long projectId) {
        List<CalculationResponse> responses = calculationService.getProjectCalculations(projectId);
        return ResponseEntity.ok(responses);
    }
}
