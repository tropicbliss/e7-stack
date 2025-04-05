// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, User } from "$lib/server/schema";

// for information about these interfaces
declare global {
    namespace App {
        interface Platform {
            env: Env;
            context: ExecutionContext;
            cf: IncomingRequestCfProperties;
        }

        interface Locals {
            user: User | null;
            session: Session | null;
        }
    }
}

export {};
