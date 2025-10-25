-- Remove pipe_spacing column from calculations table
ALTER TABLE calculations DROP COLUMN IF EXISTS pipe_spacing;

-- Verify changes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'calculations'
ORDER BY ordinal_position;
