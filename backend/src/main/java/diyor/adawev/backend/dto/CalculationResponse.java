package diyor.adawev.backend.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationResponse {
    private Long id;
    private String roomName;
    private Float roomLength;
    private Float roomWidth;
    private Float roomArea;
    private Float pipeLength;  // For PDF - actual pipe length
    private Float pipeLengthWithReserve;
    private List<MaterialItemResponse> materials;

    // Alias for PDF compatibility
    public List<MaterialItemResponse> getMaterialItems() {
        return materials;
    }
}
