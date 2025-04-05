import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { Google } from "arctic";

export function getOAuth(env: Env, origin: string) {
    return new Google(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        `${env.LOCAL_ORIGIN ?? `https://${origin}`}/login/google/callback`,
    );
}
