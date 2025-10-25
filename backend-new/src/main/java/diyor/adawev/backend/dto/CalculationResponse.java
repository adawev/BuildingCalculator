package diyor.adawev.backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationResponse {
    private Long id;
    private String roomName;
    private BigDecimal roomLength;
    private BigDecimal roomWidth;
    private BigDecimal pipeSpacing;
    private BigDecimal roomArea;
    private BigDecimal pipeLengthWithReserve;
    private Integer numberOfLoops;
    private BigDecimal heatOutput;
    private List<MaterialItemResponse> materials;
    private BigDecimal totalCost;
}
