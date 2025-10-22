package com.underfloorheating.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "calculations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Calculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "room_length", nullable = false, precision = 10, scale = 2)
    private BigDecimal roomLength; // meters

    @Column(name = "room_width", nullable = false, precision = 10, scale = 2)
    private BigDecimal roomWidth; // meters

    @Column(name = "room_area", precision = 10, scale = 2)
    private BigDecimal roomArea; // square meters

    @Column(name = "pipe_spacing", precision = 5, scale = 2)
    private BigDecimal pipeSpacing; // cm

    @Enumerated(EnumType.STRING)
    @Column(name = "installation_pattern", nullable = false)
    @Builder.Default
    private InstallationPattern installationPattern = InstallationPattern.SPIRAL;

    @Column(name = "pipe_length_calculated", precision = 10, scale = 2)
    private BigDecimal pipeLengthCalculated; // meters

    @Column(name = "pipe_length_with_reserve", precision = 10, scale = 2)
    private BigDecimal pipeLengthWithReserve; // meters (with 10% reserve)

    @Column(name = "number_of_loops")
    private Integer numberOfLoops;

    @Column(name = "heat_output", precision = 10, scale = 2)
    private BigDecimal heatOutput; // Watts

    @OneToMany(mappedBy = "calculation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MaterialItem> materialItems = new ArrayList<>();

    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum InstallationPattern {
        SPIRAL,    // Спираль (улиткой)
        SNAKE,     // Змейка
        DOUBLE_SNAKE // Двойная змейка
    }
}
