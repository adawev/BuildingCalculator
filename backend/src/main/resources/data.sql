-- Sample Materials Data for Underfloor Heating Calculator

-- Pipes
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Isitish shlankasi 16mm', 'Труба отопления 16мм', 'PIPE', 'metr', 25000, 'PEX isitish quvuri', true),
('Isitish shlankasi 20mm', 'Труба отопления 20мм', 'PIPE', 'metr', 32000, 'Katta xonalar uchun PEX quvur', true)
ON CONFLICT DO NOTHING;

-- Manifolds
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Kollector 2-yo''nalishli', 'Коллектор 2-контурный', 'MANIFOLD', 'dona', 450000, '2 chiqishli manifold', true),
('Kollector 4-yo''nalishli', 'Коллектор 4-контурный', 'MANIFOLD', 'dona', 750000, '4 chiqishli manifold', true),
('Kollector 6-yo''nalishli', 'Коллектор 6-контурный', 'MANIFOLD', 'dona', 1050000, '6 chiqishli manifold', true)
ON CONFLICT DO NOTHING;

-- Fittings
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Press-fiting 16mm', 'Фитинг прессовый 16мм', 'FITTING', 'dona', 35000, '16mm quvur uchun fiting', true),
('Press-fiting 20mm', 'Фитинг прессовый 20мм', 'FITTING', 'dona', 48000, '20mm quvur uchun fiting', true),
('Burma 90°', 'Угол 90°', 'FITTING', 'dona', 25000, '90 gradusli burma', true)
ON CONFLICT DO NOTHING;

-- Valves
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Sharikli klapan 1/2"', 'Шаровой кран 1/2"', 'VALVE', 'dona', 80000, 'Oqimni boshqarish klapani', true),
('Sharikli klapan 3/4"', 'Шаровой кран 3/4"', 'VALVE', 'dona', 105000, 'Katta quvurlar uchun klapan', true),
('Oqim nazorati klapani', 'Клапан регулировки потока', 'VALVE', 'dona', 120000, 'Sozlanuvchi oqim klapani', true)
ON CONFLICT DO NOTHING;

-- Insulation
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Issiqlik izolyatsiyasi 30mm', 'Теплоизоляция 30мм', 'INSULATION', 'm2', 50000, 'Polistirol izolyatsiya plitasi', true),
('Issiqlik izolyatsiyasi 50mm', 'Теплоизоляция 50мм', 'INSULATION', 'm2', 75000, 'Qalin izolyatsiya plitasi', true),
('Folga izolyatsiya', 'Фольгированная изоляция', 'INSULATION', 'm2', 35000, 'Aks ettiruvchi issiqlik to''siq', true)
ON CONFLICT DO NOTHING;

-- Base Materials
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Armatura to''ri 100x100', 'Арматурная сетка 100x100', 'BASE_MATERIAL', 'm2', 30000, 'Beton uchun temir to''r', true),
('O''rnatish reykasi', 'Монтажные рейки', 'BASE_MATERIAL', 'metr', 20000, 'Quvur o''rnatish uchun plastik reyка', true),
('Chekka izolyatsiya lentasi', 'Кромочная лента', 'BASE_MATERIAL', 'metr', 15000, 'Kengayish uchun chekka lenta', true)
ON CONFLICT DO NOTHING;

-- Adhesives
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, description, is_available) VALUES
('Pol uchun yelim', 'Клей для пола', 'ADHESIVE', 'kg', 45000, 'Isitilgan pol uchun maxsus yelim', true),
('Kafel yelimi elastik', 'Клей для плитки эластичный', 'ADHESIVE', 'kg', 50000, 'Isitish ustidan kafel uchun elastik yelim', true)
ON CONFLICT DO NOTHING;

-- Sample User (password is 'password123' hashed with BCrypt)
INSERT INTO users (username, email, password, full_name, phone_number, company_name, role, active) VALUES
('demo_user', 'demo@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Demo Santexnik', '+998901234567', 'Professional Heating Services', 'USER', true)
ON CONFLICT (email) DO NOTHING;

-- Sample Project
INSERT INTO projects (name, client_name, client_phone, client_address, user_id, status, notes) VALUES
('Sample Living Room Project', 'John Doe', '+998901111111', 'Tashkent, Yunusabad District', 1, 'DRAFT', 'Initial calculation for customer approval')
ON CONFLICT DO NOTHING;
