package diyor.adawev.backend.dto;

import diyor.adawev.backend.entity.Project;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {
    private String name;
    private Project.ProjectStatus status;
}
