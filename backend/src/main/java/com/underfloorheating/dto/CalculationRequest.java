package com.underfloorheating.dto;

import com.underfloorheating.entity.Calculation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String roomName;

    @NotNull(message = "Room length is required")
    @DecimalMin(value = "0.1", message = "Room length must be at least 0.1 meters")
    private BigDecimal roomLength;

    @NotNull(message = "Room width is required")
    @DecimalMin(value = "0.1", message = "Room width must be at least 0.1 meters")
    private BigDecimal roomWidth;

    @Builder.Default
    private BigDecimal pipeSpacing = new BigDecimal("15"); // cm

    @Builder.Default
    private Boolean calculatePrice = false; // Narxni hisoblash yoki yo'q
}
