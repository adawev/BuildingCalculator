package diyor.adawev.backend.repository;

import diyor.adawev.backend.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByIsAvailableTrue();
    List<Material> findByTypeAndIsAvailableTrue(Material.MaterialType type);
}
