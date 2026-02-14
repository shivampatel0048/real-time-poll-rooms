import { v4 as uuidv4 } from "uuid";

export function generateVoterToken(): string {
    return uuidv4();
}

export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string | undefined } }): string | undefined {
    const forwarded = req.headers["x-forwarded-for"];

    if (forwarded) {
        const forwardedArray = Array.isArray(forwarded) ? forwarded : [forwarded];
        return forwardedArray[0]?.split(",")[0]?.trim();
    }

    return req.socket?.remoteAddress;
}

export function sanitizeString(input: string): string {
    return input.trim();
}
