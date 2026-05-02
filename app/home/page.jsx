import HomeClient from "../../components/HomeClient";

export default function HomePage() {
  return (
    <HomeClient
      supabaseConfig={{
        url: process.env.VITE_SUPABASE_URL || "",
        anonKey: process.env.VITE_SUPABASE_ANON_KEY || "",
      }}
    />
  );
}
