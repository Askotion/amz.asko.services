-- Add policy for public access to SELECT operations
CREATE POLICY "Allow public selects" ON public.amz_sas_purchase
  FOR SELECT
  USING (true);
