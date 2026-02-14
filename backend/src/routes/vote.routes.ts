import { Router } from "express";
import { createVoteController } from "../controllers/vote.controller";
import { validateVote } from "../middlewares/validation.middleware";
import { voteLimiter } from "../middlewares/rateLimit.middleware";
import { ensureVoterToken } from "../middlewares/voterToken.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import type { Server } from "socket.io";

export function createVoteRoutes(io: Server): Router {
    const router = Router();

    router.post(
        "/votes",
        voteLimiter,
        ensureVoterToken,
        validateVote,
        asyncHandler(createVoteController(io))
    );

    return router;
}
