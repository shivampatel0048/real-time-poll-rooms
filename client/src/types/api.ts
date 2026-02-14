/**
 * API Request/Response Types
 * Shared types between frontend and backend
 */

export interface PollOption {
    id: string;
    text: string;
    voteCount: number;
}

export interface Poll {
    id: string;
    question: string;
    options: PollOption[];
    totalVotes: number;
    createdAt?: string;
}

export interface CreatePollRequest {
    question: string;
    options: string[];
}

export interface CreatePollResponse {
    pollId: string;
    shareUrl: string;
}

export interface VoteRequest {
    pollId: string;
    optionId: string;
}

export interface VoteResponse {
    voted: boolean;
}

export type ApiResponse<T> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        error: string;
        code?: string;
    };

export interface VoteUpdate {
    pollId: string;
    options: PollOption[];
    totalVotes: number;
}

export type VoteStatus = "idle" | "voting" | "voted" | "error";
