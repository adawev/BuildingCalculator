-- Default materiallarni qo'shish
-- Bu materiallar dastlab mavjud bo'ladi

INSERT INTO materials (name_uz, name_ru, type, unit, is_available) VALUES
-- Shlankalar (Quvurlar)
('Shlanka 16mm', 'Труба 16мм', 'PIPE', 'metr', true),
('Shlanka 20mm', 'Труба 20мм', 'PIPE', 'metr', true),

-- Manifold (Kollektorlar)
('Kollektor 2 ta', 'Коллектор 2 выхода', 'MANIFOLD', 'dona', true),
('Kollektor 3 ta', 'Коллектор 3 выхода', 'MANIFOLD', 'dona', true),
('Kollektor 4 ta', 'Коллектор 4 выхода', 'MANIFOLD', 'dona', true),

-- Izolyatsiya
('Penoplex 30mm', 'Пеноплекс 30мм', 'INSULATION', 'm²', true),
('Penoplex 50mm', 'Пеноплекс 50мм', 'INSULATION', 'm²', true),

-- Fitting (Fitinglar)
('Fitning', 'Фитинг', 'FITTING', 'dona', true),

-- Valve (Ventillar)
('Ventil', 'Вентиль', 'VALVE', 'dona', true),

-- Base Material (Asos materiallar)
('Cement', 'Цемент', 'BASE_MATERIAL', 'kg', true),

-- Boshqa
('Termostat', 'Термостат', 'OTHER', 'dona', true),
('Nasos', 'Насос', 'OTHER', 'dona', true);

-- Tekshirish
SELECT id, name_uz, name_ru, type, unit, is_available
FROM materials
ORDER BY type, id;
