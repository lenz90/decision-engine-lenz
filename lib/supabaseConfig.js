export function getSupabaseConfig() {
  return {
    url: process.env.VITE_SUPABASE_URL || "",
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || "",
  };
}

export function hasSupabaseConfig() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}
