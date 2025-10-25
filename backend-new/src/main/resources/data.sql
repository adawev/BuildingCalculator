-- Demo User (password: demo123)
INSERT INTO users (username, email, password, role, is_active, created_at, updated_at) VALUES
('demo', 'demo@example.com', '$2a$10$5KPOhGKLKZy7qLQHGBLFQOX8vVXN1N6K3YUr5ckHfLm2QhLZ6mCQi', 'USER', true, NOW(), NOW());

-- Material Catalog

-- Pipes
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('PE-X trubka 16mm', 'Труба PE-X 16мм', 'PIPE', 'metr', 8000.00, true),
('PE-X trubka 20mm', 'Труба PE-X 20мм', 'PIPE', 'metr', 10000.00, true);

-- Manifolds
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('Kollektor 2 konturli', 'Коллектор 2 контура', 'MANIFOLD', 'dona', 350000.00, true),
('Kollektor 3 konturli', 'Коллектор 3 контура', 'MANIFOLD', 'dona', 450000.00, true),
('Kollektor 4 konturli', 'Коллектор 4 контура', 'MANIFOLD', 'dona', 550000.00, true);

-- Insulation
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('Penopolistirol plita 30mm', 'Пенополистирол плита 30мм', 'INSULATION', 'm2', 45000.00, true),
('Penopolistirol plita 50mm', 'Пенополистирол плита 50мм', 'INSULATION', 'm2', 65000.00, true);

-- Base Material
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('Armatura to''r 100x100', 'Арматурная сетка 100x100', 'BASE_MATERIAL', 'm2', 25000.00, true),
('Gidroizolyatsiya plenka', 'Гидроизоляционная пленка', 'BASE_MATERIAL', 'm2', 8000.00, true);

-- Fittings
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('Evrokonus 16mm', 'Еврокнус 16мм', 'FITTING', 'dona', 5000.00, true),
('Evrokonus 20mm', 'Еврокнус 20мм', 'FITTING', 'dona', 6000.00, true);

-- Valves
INSERT INTO materials (name_uz, name_ru, type, unit, price_per_unit, is_available) VALUES
('Shar kran 16mm', 'Шаровой кран 16мм', 'VALVE', 'dona', 12000.00, true),
('Shar kran 20mm', 'Шаровой кран 20мм', 'VALVE', 'dona', 15000.00, true);
