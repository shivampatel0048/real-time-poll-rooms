import type { Request, Response, NextFunction } from "express";
import { validateEnv } from "../config/env";
import { logger } from "../utils/logger";

const env = validateEnv();

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (res.headersSent) {
        return next(err);
    }

    logger.error("Error:", {
        message: err.message,
        stack: env.NODE_ENV === "development" ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        error: env.NODE_ENV === "production" ? "Internal server error" : err.message,
        code: err.name,
    });
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: "Resource not found",
    });
}
