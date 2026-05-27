import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uzxejobfqbjldutqplpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGVqb2JmcWJqbGR1dHFwbHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU4MDQ1OSwiZXhwIjoyMDg5MTU2NDU5fQ.Fc-70eYP_73PmR0NZYGaaE3GnTltco0wBnPk7OpyagQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
