import crypto from "node:crypto";

export const SESSION_COOKIE = "decision-engine-session";
export const STATE_COOKIE = "decision-engine-oauth-state";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SECRET || "decision-engine-local-dev-secret";
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionCookie(user) {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      name: user.name || user.email.split("@")[0],
      picture: user.picture || "",
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function readSessionCookie(cookieValue) {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");

  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
