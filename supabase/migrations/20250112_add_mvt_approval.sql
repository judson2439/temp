-- Add approval fields to status_mvt_combinations
ALTER TABLE status_mvt_combinations 
ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMPTZ,
ADD COLUMN rejection_reason TEXT,
ADD COLUMN preview_enabled BOOLEAN DEFAULT true;

-- Create index for approval queries
CREATE INDEX idx_mvt_combinations_approval ON status_mvt_combinations(test_id, approval_status);

-- Add RLS policy for approval actions
CREATE POLICY "Admins can approve combinations"
ON status_mvt_combinations FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');
