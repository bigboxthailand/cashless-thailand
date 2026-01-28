import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://euavftppzicwjhbugiys.supabase.co";
const supabaseKey = "sb_publishable_poJ-NobQZpARz_G4cWG96Q_vxIPZkrE";
const supabase = createClient(supabaseUrl, supabaseKey) ;

export { supabase as s };
