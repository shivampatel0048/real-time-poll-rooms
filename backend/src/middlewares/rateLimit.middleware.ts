import rateLimit from "express-rate-limit";

export const voteLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: {
        success: false,
        error: "Too many vote attempts, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const createPollLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        success: false,
        error: "Too many polls created, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        error: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
