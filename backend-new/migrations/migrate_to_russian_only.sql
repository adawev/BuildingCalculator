-- Migrate to Russian-only language
-- Drop Uzbek columns and rename Russian columns

-- Materials table: drop name_uz, rename name_ru to name
ALTER TABLE materials DROP COLUMN IF EXISTS name_uz;
ALTER TABLE materials RENAME COLUMN name_ru TO name;

-- Verify changes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'materials'
ORDER BY ordinal_position;
