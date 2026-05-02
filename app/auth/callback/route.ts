import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "../../../lib/supabaseConfig";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return NextResponse.redirect(new URL("/?auth=missing_config", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    return NextResponse.redirect(new URL("/?auth=token_error", request.url));
  }

  const user = data.user;
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "";

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
    });

    if (profileError) {
      return NextResponse.redirect(new URL("/?auth=profile_error", request.url));
    }
  }

  return response;
}
