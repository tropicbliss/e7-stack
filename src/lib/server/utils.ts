const UNAUTHORISED_USER = "Unauthorised user";

export function restrictUnauthorisedUser() {
    return new Response(UNAUTHORISED_USER, {
        status: 401,
    });
}
