package com.underfloorheating.repository;

import com.underfloorheating.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByType(Material.MaterialType type);
    List<Material> findByIsAvailable(Boolean isAvailable);
    List<Material> findByTypeAndIsAvailable(Material.MaterialType type, Boolean isAvailable);
}
