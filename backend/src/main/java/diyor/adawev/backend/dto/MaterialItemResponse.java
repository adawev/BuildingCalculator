package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialItemResponse {
    private String materialName;
    private Float quantity;
    private String unit;
    private String originalName;
    private String type;
}
