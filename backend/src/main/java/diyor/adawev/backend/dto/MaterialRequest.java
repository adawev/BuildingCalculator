package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialRequest {
    private String name;
    private String type;
    private String unit;
    private Boolean isAvailable;
}
