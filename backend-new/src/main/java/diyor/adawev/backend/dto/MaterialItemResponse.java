package diyor.adawev.backend.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialItemResponse {
    private Long id;
    private String materialName;
    private BigDecimal quantity;
    private String unit;
}
