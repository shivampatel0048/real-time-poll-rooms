import type { Request, Response, NextFunction } from "express";
import * as voteService from "../services/vote.service";
import type { VoteRequest, ApiResponse, VoteResponse } from "../types/api.types";
import { getClientIp } from "../utils/helpers";
import type { Server } from "socket.io";

/**
 * Submits a vote for a poll option
 * @endpoint POST /api/votes
 * @body { pollId: string, optionId: string }
 * @returns { success: true, data: { voted: true } }
 * @throws 400 if validation fails or user already voted
 * @throws 404 if poll or option not found
 */
export function createVoteController(io: Server) {
    return async function submitVote(
        req: Request,
        res: Response<ApiResponse<VoteResponse>>,
        next: NextFunction
    ): Promise<void> {
        try {
            const input = req.body as VoteRequest;
            const voterToken = String(req.voterToken);

            if (!voterToken) {
                res.status(400).json({
                    success: false,
                    error: "Voter token not found",
                });
                return;
            }

            const ipAddress = getClientIp(req);

            const voteUpdate = await voteService.submitVote(input, String(voterToken), ipAddress);

            // Emit real-time update to all clients in poll room
            io.to(input.pollId).emit("vote_update", voteUpdate);

            res.status(201).json({
                success: true,
                data: {
                    voted: true,
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("already voted")) {
                    res.status(400).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
                if (error.message.includes("not found")) {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
            }
            next(error);
        }
    };
}
