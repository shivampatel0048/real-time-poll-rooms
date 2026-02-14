import * as voteModel from "../models/vote.model";
import * as pollModel from "../models/poll.model";
import type { VoteRequest, VoteUpdate } from "../types/api.types";
import { DatabaseError } from "pg";

export async function submitVote(
    input: VoteRequest,
    voterToken: string,
    ipAddress?: string
): Promise<VoteUpdate> {
    // Verify poll exists
    const poll = await pollModel.findPollById(input.pollId);
    if (!poll) {
        throw new Error("Poll not found");
    }

    // Verify option exists and belongs to poll
    const option = await pollModel.findPollOptionById(input.optionId);
    if (!option || option.poll_id !== input.pollId) {
        throw new Error("Invalid poll option");
    }

    // Check if user has already voted
    const hasVotedAlready = await voteModel.hasVoted(input.pollId, voterToken);
    if (hasVotedAlready) {
        throw new Error("You have already voted in this poll");
    }

    try {
        // Create vote (atomic with vote count increment)
        await voteModel.createVote({
            pollId: input.pollId,
            optionId: input.optionId,
            voterToken,
            ipAddress,
        });
    } catch (error) {
        // Handle duplicate vote attempt (race condition)
        if (error instanceof DatabaseError && error.code === "23505") {
            throw new Error("You have already voted in this poll");
        }
        throw error as Error;
    }

    // Fetch updated poll data for real-time broadcast
    const updatedPoll = await pollModel.findPollById(input.pollId);
    if (!updatedPoll) {
        throw new Error("Failed to retrieve updated poll data");
    }

    return {
        pollId: updatedPoll.id,
        options: updatedPoll.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            voteCount: opt.vote_count,
        })),
        totalVotes: updatedPoll.totalVotes,
    };
}

export async function checkVoteStatus(pollId: string, voterToken: string): Promise<boolean> {
    return await voteModel.hasVoted(pollId, voterToken);
}
