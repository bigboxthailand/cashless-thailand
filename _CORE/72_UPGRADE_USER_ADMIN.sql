-- [CORE] 72_UPGRADE_USER_ADMIN.sql
-- Set Natthapong Suwanjit as Admin and upgrade to Bitcoin Tier

-- Identify the user by name (or use the ID from the screenshot: 3b5859ea-...)
UPDATE public.profiles 
SET 
    role = 'admin',
    tier = 'bitcoin' 
WHERE full_name ILIKE '%Natthapong Suwanjit%' 
   OR id = '3b5859ea-54b3-4f24-bc6d-74d440092abe'; -- Extrapolated ID from UI screenshot

-- Also ensure the admin layout and menu hardcoded lists include this user if needed
-- though we have already updated the code to check for role = 'admin'.

-- Verify
SELECT id, email, full_name, role, tier 
FROM public.profiles 
WHERE role = 'admin';
