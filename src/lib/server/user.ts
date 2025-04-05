import { eq } from "drizzle-orm";
import { type User, userTable } from "./schema";
import { db } from "./db";

export async function createUser(
    googleId: string,
    email: string,
    name: string,
    picture: string,
): Promise<User> {
    const result = await db.insert(userTable).values({
        googleId,
        email,
        name,
        picture,
    }).returning();
    if (result.length < 1) {
        throw new Error("Unexpected error");
    }
    return result[0];
}

export async function getUserFromGoogleId(
    googleId: string,
): Promise<User | null> {
    const result = await db.select().from(userTable).where(
        eq(userTable.googleId, googleId),
    );
    if (result.length < 1) {
        return null;
    }
    return result[0];
}
