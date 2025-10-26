-- Updated materials insert with name_ru and name_uz
-- Insert default materials for underfloor heating calculation

INSERT INTO materials (name, name_ru, name_uz, type, unit, is_available, price_per_unit) VALUES
('Труба 16мм', 'Труба 16мм', 'Quvur 16mm', 'PIPE', 'м', true, 0),
('Коллектор 3 выхода', 'Коллектор 3 выхода', 'Kollektor 3 chiqish', 'MANIFOLD', 'шт', true, 0),
('Пеноплекс 30мм', 'Пеноплекс 30мм', 'Penopleks 30mm', 'INSULATION', 'шт', true, 0),
('Крипление унитаз', 'Крипление унитаз', 'Hojatxona mahkamlash', 'FITTING', 'пачка', true, 0),
('Втулка', 'Втулка', 'Vtulka', 'FITTING', 'шт', true, 0),
('Утиплител 16', 'Утиплител 16', 'Izolyator 16', 'INSULATION', 'шт', true, 0),
('Скоба', 'Скоба', 'Skoba', 'FITTING', 'шт', true, 0),
('Фольга', 'Фольга', 'Folga', 'BASE_MATERIAL', 'м', true, 0),
('Пена', 'Пена', 'Pena', 'ADHESIVE', 'шт', true, 0),
('Пистолет для Пена', 'Пистолет для Пена', 'Pena pistoleti', 'OTHER', 'шт', true, 0),
('Чопик 6х40', 'Чопик 6х40', 'Chopik 6x40', 'FITTING', 'кг', true, 0),
('Парашут', 'Парашут', 'Parashut', 'FITTING', 'шт', true, 0),
('Демферний лента', 'Демферний лента', 'Demfer lenta', 'BASE_MATERIAL', 'м', true, 0);

-- Verify
SELECT id, name_ru, name_uz, type, unit, is_available
FROM materials
ORDER BY type, id;
