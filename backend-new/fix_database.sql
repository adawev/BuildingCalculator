-- Fix database to allow NULL values for project_id and user_id
-- Run this script in PostgreSQL

-- Make project_id nullable in calculations table
ALTER TABLE calculations ALTER COLUMN project_id DROP NOT NULL;

-- Make user_id nullable in projects table (if it exists with NOT NULL constraint)
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- Verify changes
SELECT
    table_name,
    column_name,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('calculations', 'projects')
  AND column_name IN ('project_id', 'user_id');
