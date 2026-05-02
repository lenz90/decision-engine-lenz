import { NextResponse } from "next/server";
import {
  createSessionCookie,
  sessionCookieOptions,
  SESSION_COOKIE,
  STATE_COOKIE,
} from "../../../../../lib/session";

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(new URL("/?auth=oauth_denied", request.url));
  }

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/?auth=invalid_state", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      code,
      grant_type: "authorization_code",
      redirect_uri: `${baseUrl}/api/auth/google/callback`,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/?auth=token_error", request.url));
  }

  const tokens = await tokenResponse.json();
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  if (!profileResponse.ok) {
    return NextResponse.redirect(new URL("/?auth=profile_error", request.url));
  }

  const profile = await profileResponse.json();
  const email = String(profile.email || "").toLowerCase();

  if (!email.endsWith("@gmail.com")) {
    return NextResponse.redirect(new URL("/?auth=gmail_required", request.url));
  }

  const response = NextResponse.redirect(new URL("/home", request.url));
  response.cookies.delete(STATE_COOKIE);
  response.cookies.set(
    SESSION_COOKIE,
    createSessionCookie({
      email,
      name: profile.name,
      picture: profile.picture,
    }),
    sessionCookieOptions,
  );

  return response;
}
