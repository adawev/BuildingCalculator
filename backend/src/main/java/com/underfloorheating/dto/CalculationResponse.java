package com.underfloorheating.dto;

import com.underfloorheating.entity.Calculation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationResponse {

    private Long id;
    private Long projectId;
    private String roomName;
    private BigDecimal roomLength;
    private BigDecimal roomWidth;
    private BigDecimal roomArea;
    private BigDecimal pipeSpacing;
    private Calculation.InstallationPattern installationPattern;
    private BigDecimal pipeLengthCalculated;
    private BigDecimal pipeLengthWithReserve;
    private Integer numberOfLoops;
    private BigDecimal heatOutput;
    private List<MaterialItemResponse> materials;
    private BigDecimal totalCost;
    private LocalDateTime createdAt;
}
