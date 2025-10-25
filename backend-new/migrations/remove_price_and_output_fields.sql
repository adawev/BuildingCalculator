-- Remove price-related and output fields from database

-- Drop price columns from materials table
ALTER TABLE materials DROP COLUMN IF EXISTS price_per_unit;

-- Drop price columns from material_items table
ALTER TABLE material_items DROP COLUMN IF EXISTS unit_price;
ALTER TABLE material_items DROP COLUMN IF EXISTS total_price;

-- Drop heat output and loops columns from calculations table
ALTER TABLE calculations DROP COLUMN IF EXISTS heat_output;
ALTER TABLE calculations DROP COLUMN IF EXISTS number_of_loops;
ALTER TABLE calculations DROP COLUMN IF EXISTS total_cost;

-- Verify changes for materials table
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'materials'
ORDER BY ordinal_position;

-- Verify changes for material_items table
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'material_items'
ORDER BY ordinal_position;

-- Verify changes for calculations table
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'calculations'
ORDER BY ordinal_position;
