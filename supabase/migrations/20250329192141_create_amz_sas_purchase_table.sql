-- Migration: create_amz_sas_purchase_table.sql

-- Ensure the pgcrypto extension is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.amz_sas_purchase (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  asin text NOT NULL UNIQUE,
  quantity integer NOT NULL,
  cost_price numeric(10,2) NOT NULL,
  sale_price numeric(10,2) NOT NULL,
  vat_on_cost boolean NOT NULL,
  estimated_sales text
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.amz_sas_purchase ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to perform all operations
CREATE POLICY "Authenticated access" ON public.amz_sas_purchase
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public inserts" ON public.amz_sas_purchase
  FOR INSERT
  WITH CHECK (true);