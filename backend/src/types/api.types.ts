export interface CreatePollRequest {
    question: string;
    options: string[];
}

export interface CreatePollResponse {
    pollId: string;
    shareUrl: string;
}

export interface PollResponse {
    id: string;
    question: string;
    options: Array<{
        id: string;
        text: string;
        voteCount: number;
    }>;
    totalVotes: number;
}

export interface VoteRequest {
    pollId: string;
    optionId: string;
}

export interface VoteResponse {
    voted: true;
}

export interface VoteUpdate {
    pollId: string;
    options: Array<{
        id: string;
        text: string;
        voteCount: number;
    }>;
    totalVotes: number;
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
