package diyor.adawev.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "material_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calculation_id")
    private Calculation calculation;

    // Material ma'lumotlarini to'g'ridan-to'g'ri saqlash (relation o'rniga)
    private String materialName;
    private String materialType;
    private String unit;
    private Float quantity;
}
