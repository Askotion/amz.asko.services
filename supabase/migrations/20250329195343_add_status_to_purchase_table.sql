-- Migration: add_status_field_to_amz_sas_purchase_table.sql

-- Create the ENUM type if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_status') THEN
    CREATE TYPE purchase_status AS ENUM ('draft', 'purchased', 'shipped', 'received');
  END IF;
END $$;

-- Add the new status column to the table
ALTER TABLE public.amz_sas_purchase
ADD COLUMN status purchase_status NOT NULL DEFAULT 'draft';

