import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// TODO: вернуть SUPABASE_SERVICE_KEY, но переписать функции с получением на серверные

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
