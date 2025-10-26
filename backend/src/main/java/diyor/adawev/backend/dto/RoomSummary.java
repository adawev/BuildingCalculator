package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomSummary {
    private Long calculationId;
    private String roomName;
    private Float roomArea;
    private Float pipeLength;
}
