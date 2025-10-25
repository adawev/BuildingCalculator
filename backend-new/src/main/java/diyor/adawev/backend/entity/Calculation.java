package diyor.adawev.backend.entity;

import jakarta.persistence.*;
import lombok.*;
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
    @JoinColumn(name = "project_id")
    private Project project;  // Optional - can be null for calculations without a project

    private String roomName;
    private BigDecimal roomLength;
    private BigDecimal roomWidth;
    private BigDecimal roomArea;
    private BigDecimal pipeLength;
    private Integer numberOfLoops;
    private BigDecimal heatOutput;
    private BigDecimal totalCost;

    @Builder.Default
    @OneToMany(mappedBy = "calculation", cascade = CascadeType.ALL)
    private List<MaterialItem> materialItems = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
}
