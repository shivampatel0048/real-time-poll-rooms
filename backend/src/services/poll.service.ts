import * as pollModel from "../models/poll.model";
import type { CreatePollRequest, PollResponse } from "../types/api.types";
import type { PollWithOptions } from "../types/models.types";
import { sanitizeString } from "../utils/helpers";
import { validateEnv } from "../config/env";
import { DatabaseError } from "pg";

const env = validateEnv();

export async function createPoll(input: CreatePollRequest): Promise<{ poll: PollWithOptions; shareUrl: string }> {
    // Sanitize inputs
    const question = sanitizeString(input.question);
    const options = input.options.map(sanitizeString);

    // Business rule: minimum 2 options
    if (options.length < 2) {
        throw new Error("Poll must have at least 2 options");
    }

    // Business rule: maximum 10 options
    if (options.length > 10) {
        throw new Error("Poll cannot have more than 10 options");
    }

    // Create poll with options
    try {
        const poll = await pollModel.createPoll({ question, options });

        // Generate shareable URL
        const shareUrl = `${env.FRONTEND_URL}/poll/${poll.id}`;

        return { poll, shareUrl };
    } catch (error) {
        // Handle duplicate option error
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new Error("All poll options must be unique. Please remove duplicate options.");
        }
        throw error;
    }
}

export async function getPollById(pollId: string): Promise<PollResponse | null> {
    const poll = await pollModel.findPollById(pollId);

    if (!poll) {
        return null;
    }

    return {
        id: poll.id,
        question: poll.question,
        options: poll.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            voteCount: opt.vote_count,
        })),
        totalVotes: poll.totalVotes,
    };
}
