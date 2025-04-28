import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://talmzswbtzwycpmgdfzb.supabase.co";
const apiKey =
  import.meta.env.VITE_ALBUM_RANKER_API_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhbG16c3didHp3eWNwbWdkZnpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNTc2NjIsImV4cCI6MjA1NTczMzY2Mn0.KKXHeivhV4ggJpGd_9b6Puvah0nk7Pg9ovD2LgwTv2I";

const supabase = createClient(supabaseUrl, apiKey);

export default supabase;
