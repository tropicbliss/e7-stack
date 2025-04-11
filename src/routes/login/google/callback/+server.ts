import { ObjectParser } from "@pilcrowjs/object-parser";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "./$types";
import type { OAuth2Tokens } from "arctic";
import { getOAuth } from "$lib/server/oauth";
import { createUser, getUserFromGoogleId } from "$lib/server/user";
import {
    createSession,
    generateSessionToken,
    setSessionTokenCookie,
} from "$lib/server/session";

const AUTH_REDIRECT_PATH = "/";

export async function GET(event: RequestEvent): Promise<Response> {
    const storedState = event.cookies.get("google_oauth_state") ?? null;
    const codeVerifier = event.cookies.get("google_code_verifier") ?? null;
    const code = event.url.searchParams.get("code");
    const state = event.url.searchParams.get("state");

    if (
        storedState === null || codeVerifier === null || code === null ||
        state === null
    ) {
        return new Response("Please restart the process.", {
            status: 400,
        });
    }
    if (storedState !== state) {
        return new Response("Please restart the process.", {
            status: 400,
        });
    }

    const origin = event.request.headers.get("host");
    if (origin === null) {
        return new Response(null, {
            status: 403,
        });
    }
    const oauth = getOAuth(event.platform!.env, origin);

    let tokens: OAuth2Tokens;
    try {
        tokens = await oauth.validateAuthorizationCode(code, codeVerifier);
    } catch (e) {
        return new Response("Please restart the process.", {
            status: 400,
        });
    }

    const claims = decodeIdToken(tokens.idToken());
    const claimsParser = new ObjectParser(claims);

    const googleId = claimsParser.getString("sub");
    const name = claimsParser.getString("name");
    const picture = claimsParser.getString("picture");
    const email = claimsParser.getString("email");

    const existingUser = await getUserFromGoogleId(googleId);
    if (existingUser !== null) {
        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, existingUser.id);
        setSessionTokenCookie(event, sessionToken, session.expiresAt);
        return new Response(null, {
            status: 302,
            headers: {
                Location: AUTH_REDIRECT_PATH,
            },
        });
    }

    const user = await createUser(googleId, email, name, picture);
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return new Response(null, {
        status: 302,
        headers: {
            Location: AUTH_REDIRECT_PATH,
        },
    });
}
