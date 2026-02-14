import { Router } from "express";
import { createPoll, getPollById } from "../controllers/poll.controller";
import { validateCreatePoll } from "../middlewares/validation.middleware";
import { createPollLimiter } from "../middlewares/rateLimit.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/polls", createPollLimiter, validateCreatePoll, asyncHandler(createPoll));
router.get("/polls/:pollId", asyncHandler(getPollById));

export default router;
