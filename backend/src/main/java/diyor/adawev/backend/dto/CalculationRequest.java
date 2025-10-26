package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculationRequest {
    private Long projectId;
    private String roomName;
    private Float roomLength;
    private Float roomWidth;

    @Builder.Default
    private Boolean calculatePrice = false;
}
