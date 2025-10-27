package diyor.adawev.backend.repository;

import diyor.adawev.backend.entity.Calculation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CalculationRepository extends JpaRepository<Calculation, Long> {

    @EntityGraph(attributePaths = {"materialItems"})
    List<Calculation> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    @EntityGraph(attributePaths = {"materialItems"})
    Optional<Calculation> findById(Long id);
}
