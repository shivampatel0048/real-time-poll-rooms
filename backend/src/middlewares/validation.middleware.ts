import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const createPollSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters").max(500, "Question must not exceed 500 characters"),
    options: z
        .array(z.string().min(1, "Option cannot be empty").max(200, "Option must not exceed 200 characters"))
        .min(2, "At least 2 options required")
        .max(10, "Maximum 10 options allowed"),
});

export const voteSchema = z.object({
    pollId: z.string().uuid("Invalid poll ID"),
    optionId: z.string().uuid("Invalid option ID"),
});

export function validateCreatePoll(req: Request, res: Response, next: NextFunction): void {
    try {
        req.body = createPollSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors,
            });
            return;
        }
        next(error);
    }
}

export function validateVote(req: Request, res: Response, next: NextFunction): void {
    try {
        req.body = voteSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors,
            });
            return;
        }
        next(error);
    }
}
