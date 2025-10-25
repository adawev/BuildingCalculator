package diyor.adawev.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "materials")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nameUz;
    private String nameRu;

    @Enumerated(EnumType.STRING)
    private MaterialType type;

    private String unit;
    private BigDecimal pricePerUnit;

    @Builder.Default
    private Boolean isAvailable = true;

    public enum MaterialType {
        PIPE, MANIFOLD, FITTING, VALVE, INSULATION, BASE_MATERIAL, ADHESIVE, OTHER
    }
}
