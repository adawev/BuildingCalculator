package com.underfloorheating.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "name_uz", nullable = false)
    private String nameUz;

    @Column(name = "name_ru", nullable = false)
    private String nameRu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialType type;

    @Column(nullable = false)
    private String unit;

    @Column(name = "price_per_unit", precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    @Column(length = 500)
    private String description;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    public enum MaterialType {
        PIPE,           // Труба (shlanka)
        MANIFOLD,       // Коллектор (kollector)
        FITTING,        // Фитинги
        VALVE,          // Клапаны
        INSULATION,     // Изоляция
        BASE_MATERIAL,  // Основание
        ADHESIVE,       // Клей
        OTHER
    }
}
