package diyor.adawev.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CollectorInfo {
    @Id
    @Column(nullable = false)
    private Integer name;
    @Column(nullable = false)
    private Integer count;
}
