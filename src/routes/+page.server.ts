import { trpcServer } from "$lib/server/server";

export const load = async (event) => {
    // You don't need to return the result of this function,
    // just call it and your data will be hydrated!
    await trpcServer.greeting.ssr({ name: "the e7 stack" });
};
