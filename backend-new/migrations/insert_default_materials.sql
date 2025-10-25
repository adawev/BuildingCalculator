-- Default materials (Russian only)
-- Insert default materials for underfloor heating calculation

INSERT INTO materials (name, type, unit, is_available) VALUES
-- Pipes
('Труба 16мм', 'PIPE', 'м', true),
('Труба 20мм', 'PIPE', 'м', true),

-- Manifolds
('Коллектор 2 выхода', 'MANIFOLD', 'шт', true),
('Коллектор 3 выхода', 'MANIFOLD', 'шт', true),
('Коллектор 4 выхода', 'MANIFOLD', 'шт', true),

-- Insulation
('Пеноплекс 30мм', 'INSULATION', 'м²', true),
('Пеноплекс 50мм', 'INSULATION', 'м²', true),

-- Fittings
('Фитинг', 'FITTING', 'шт', true),

-- Valves
('Вентиль', 'VALVE', 'шт', true),

-- Base materials
('Цемент', 'BASE_MATERIAL', 'кг', true),

-- Other
('Термостат', 'OTHER', 'шт', true),
('Насос', 'OTHER', 'шт', true);

-- Verify
SELECT id, name, type, unit, is_available
FROM materials
ORDER BY type, id;
