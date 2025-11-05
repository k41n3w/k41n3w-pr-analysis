-- Enable Row Level Security on pr_metrics table
-- This maintains current public read access but adds write protection
ALTER TABLE pr_metrics ENABLE ROW LEVEL SECURITY;

-- Allow all users to read data (maintains current access patterns)
CREATE POLICY "Allow public read access" ON pr_metrics
FOR SELECT 
USING (true);

-- Restrict writes to authenticated service role only
CREATE POLICY "Service role can insert" ON pr_metrics
FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update" ON pr_metrics
FOR UPDATE TO service_role
USING (true);

CREATE POLICY "Service role can delete" ON pr_metrics
FOR DELETE TO service_role
USING (true);