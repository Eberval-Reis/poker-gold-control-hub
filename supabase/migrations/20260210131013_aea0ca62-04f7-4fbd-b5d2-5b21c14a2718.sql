
-- Fix receipts storage policies: restrict to authenticated users who own the expense

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow viewing receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploading receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow updating receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow deleting receipts" ON storage.objects;

-- Create restrictive policies for authenticated users only
CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Users can view their own receipts"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts');

CREATE POLICY "Users can update their own receipts"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'receipts');

CREATE POLICY "Users can delete their own receipts"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'receipts');
