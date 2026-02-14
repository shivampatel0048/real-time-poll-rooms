import type { Request, Response, NextFunction } from "express";
import * as pollService from "../services/poll.service";
import type { CreatePollRequest, ApiResponse, CreatePollResponse, PollResponse } from "../types/api.types";

/**
 * Creates a new poll with options
 * @endpoint POST /api/polls
 * @body { question: string, options: string[] }
 * @returns { success: true, data: { pollId: string, shareUrl: string } }
 * @throws 400 if validation fails
 */
export async function createPoll(
    req: Request,
    res: Response<ApiResponse<CreatePollResponse>>,
    next: NextFunction
): Promise<void> {
    try {
        const input = req.body as CreatePollRequest;
        const result = await pollService.createPoll(input);

        res.status(201).json({
            success: true,
            data: {
                pollId: result.poll.id,
                shareUrl: result.shareUrl,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves poll details by ID
 * @endpoint GET /api/polls/:pollId
 * @returns { success: true, data: PollResponse }
 * @throws 404 if poll not found
 */
export async function getPollById(
    req: Request,
    res: Response<ApiResponse<PollResponse>>,
    next: NextFunction
): Promise<void> {
    try {
        const { pollId } = req.params;

        if (!pollId) {
            res.status(400).json({
                success: false,
                error: "Poll ID is required",
            });
            return;
        }

        const poll = await pollService.getPollById(pollId);

        if (!poll) {
            res.status(404).json({
                success: false,
                error: "Poll not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: poll,
        });
    } catch (error) {
        next(error);
    }
}
