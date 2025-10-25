-- Complete database fix for calculations table
-- Make all columns nullable that should be optional

-- Make installation_pattern nullable (or drop it if not needed)
ALTER TABLE calculations ALTER COLUMN installation_pattern DROP NOT NULL;

-- Make room_length and room_width nullable (they're required but not in DB constraint)
ALTER TABLE calculations ALTER COLUMN room_length DROP NOT NULL;
ALTER TABLE calculations ALTER COLUMN room_width DROP NOT NULL;

-- Verify all changes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'calculations'
ORDER BY ordinal_position;
