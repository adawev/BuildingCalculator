package diyor.adawev.backend.repository;

import diyor.adawev.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByIsAvailableTrue();
    Optional<Material> findByType(String type);
}
