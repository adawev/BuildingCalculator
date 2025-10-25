package diyor.adawev.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationRequest {
    private Long projectId;
    private String roomName;
    private BigDecimal roomLength;
    private BigDecimal roomWidth;

    @Builder.Default
    private BigDecimal pipeSpacing = new BigDecimal("15");

    @Builder.Default
    private Boolean calculatePrice = false;
}
