-- Default materials (Russian only)
-- Insert default materials for underfloor heating calculation

INSERT INTO materials (name, type, unit, is_available) VALUES
('Труба 16мм', 'PIPE_16', 'м', true),
('Коллектор 3 выхода', 'KOLLEKTOR', 'шт', true),
('Пеноплекс 30мм', 'PENOPLEKS', 'шт', true),
('Крипление унитаз', 'KRIPLENIE_UNITAZ', 'пачка', true),
('Втулка', 'VTULKA', 'шт', true),
('Утиплител 16', 'UTIPLITEL_16', 'шт', true),
('Скоба', 'SKOBA', 'шт', true),
('Фольга', 'FOLGA', 'м', true),
('Пена', 'PENA', 'шт', true),
('Пистолет для Пена', 'PISTOLET_PENA', 'шт', true),
('Чопик 6х40', 'CHOPIK_640', 'кг', true),
('Парашут', 'PARASHUT', 'шт', true),
('Демферний лента', 'DEMFERNIY_LENTA', 'м', true);
-- Verify
SELECT id, name, type, unit, is_available
FROM materials
ORDER BY type, id;
