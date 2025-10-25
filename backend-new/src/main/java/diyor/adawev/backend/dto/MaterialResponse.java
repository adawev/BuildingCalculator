package diyor.adawev.backend.dto;

import diyor.adawev.backend.entity.Material;
import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {
    private Long id;
    private String name;
    private String type;
    private String unit;
    private Boolean isAvailable;
}
