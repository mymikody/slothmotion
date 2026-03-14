import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jnvsccqwgvdyrlvwvqvn.supabase.co";
const supabaseKey = "sb_publishable_o1JHmAKNu32y8EZcMuWSJQ_Kihh2n3c";

export const supabase = createClient(supabaseUrl, supabaseKey);