package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialSummary {
    private String materialName;
    private Float quantity;
    private String unit;
    private String type;
}
