-- Update the profile name for the shop owner
UPDATE profiles
SET full_name = 'Natthapong Suwanjit'
WHERE id = '3b5859ea-8a64-41f1-8071-75d35efa67a7';

-- Verify the change
SELECT * FROM profiles WHERE id = '3b5859ea-8a64-41f1-8071-75d35efa67a7';
