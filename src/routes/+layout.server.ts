import type { LayoutServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: LayoutServerLoad = async (event) => {
    return {
        trpc: trpcServer.hydrateToClient(event),
    };
};
