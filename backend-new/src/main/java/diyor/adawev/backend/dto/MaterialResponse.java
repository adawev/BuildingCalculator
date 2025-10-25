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
    private String nameUz;
    private String nameRu;
    private Material.MaterialType type;
    private String unit;
    private BigDecimal pricePerUnit;
    private Boolean isAvailable;
}
