import { UPSTASH_TOKEN, UPSTASH_URL } from "$env/static/private";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/cloudflare";

const cache = new Map();

export const ratelimit = new Ratelimit({
    redis: new Redis({
        url: UPSTASH_URL,
        token: UPSTASH_TOKEN,
    }),
    limiter: Ratelimit.tokenBucket(1, "1 s", 100),
    analytics: true,
    ephemeralCache: cache,
});
