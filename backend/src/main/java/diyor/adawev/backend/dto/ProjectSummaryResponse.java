package diyor.adawev.backend.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSummaryResponse {
    private Long projectId;
    private String projectName;
    private Integer roomCount;
    private Float totalArea;
    private Float totalPipeLength;
    private List<MaterialSummary> totalMaterials;
    private List<RoomSummary> rooms;
}
