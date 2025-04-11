import { generateCodeVerifier, generateState } from "arctic";

import type { RequestEvent } from "./$types";
import { getOAuth } from "$lib/server/oauth";

export function GET(event: RequestEvent): Response {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const origin = event.request.headers.get("host");
    if (origin === null) {
        return new Response(null, {
            status: 403,
        });
    }
    const oauth = getOAuth(
        event.platform!.env,
        origin,
    );
    const url = oauth.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
        "email",
    ]);
    const secure = !Boolean(event.platform!.env.LOCAL_ORIGIN);
    event.cookies.set("google_oauth_state", state, {
        httpOnly: true,
        maxAge: 60 * 10,
        secure,
        path: "/",
        sameSite: "lax",
    });
    event.cookies.set("google_code_verifier", codeVerifier, {
        httpOnly: true,
        maxAge: 60 * 10,
        secure,
        path: "/",
        sameSite: "lax",
    });
    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    });
}
