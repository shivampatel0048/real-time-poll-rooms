import type { Request, Response, NextFunction } from "express";
import { generateVoterToken } from "../utils/helpers";

const VOTER_TOKEN_COOKIE = "voter_token";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

export function ensureVoterToken(req: Request, res: Response, next: NextFunction): void {
    let token = req.cookies[VOTER_TOKEN_COOKIE] as string | undefined;

    if (!token) {
        token = generateVoterToken();

        res.cookie(VOTER_TOKEN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: COOKIE_MAX_AGE,
        });
    }

    // Attach token to request for use in controllers
    req.voterToken = token;

    next();
}
