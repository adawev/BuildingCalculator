#!/bin/bash
# Run all database migrations in order

DB_NAME="heating_calculator"
DB_USER="postgres"

echo "Running database migrations..."

# 1. Remove pipe spacing
echo "1. Removing pipe_spacing column..."
psql -U $DB_USER -d $DB_NAME -f remove_pipe_spacing.sql

# 2. Remove price and output fields
echo "2. Removing price and output fields..."
psql -U $DB_USER -d $DB_NAME -f remove_price_and_output_fields.sql

# 3. Migrate to Russian only
echo "3. Migrating to Russian only..."
psql -U $DB_USER -d $DB_NAME -f migrate_to_russian_only.sql

# 4. Insert default materials
echo "4. Inserting default materials..."
psql -U $DB_USER -d $DB_NAME -f insert_default_materials.sql

echo "All migrations completed!"
