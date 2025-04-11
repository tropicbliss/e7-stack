import {
    deleteSessionTokenCookie,
    setSessionTokenCookie,
    validateSessionToken,
} from "$lib/server/session";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { ratelimit } from "$lib/server/rate-limit";

const rateLimitHandle: Handle = async ({ event, resolve }) => {
    const clientIP = event.request.headers.get("cf-connecting-ip");
    if (clientIP === null) {
        return resolve(event);
    }
    let cost: number;
    if (event.request.method === "GET" || event.request.method === "OPTIONS") {
        cost = 1;
    } else {
        cost = 3;
    }
    const { success, pending } = await ratelimit.limit(clientIP, {
        rate: cost,
    });
    if (!success) {
        return new Response("Too many requests", {
            status: 429,
        });
    }
    event.platform?.context.waitUntil(pending);
    return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session") ?? null;
    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    if (session !== null) {
        setSessionTokenCookie(event, token, session.expiresAt);
    } else {
        deleteSessionTokenCookie(event);
    }

    event.locals.session = session;
    event.locals.user = user;

    return resolve(event);
};

export const handle = sequence(rateLimitHandle, authHandle);
