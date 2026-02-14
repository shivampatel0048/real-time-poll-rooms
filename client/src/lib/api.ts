import { apiClient } from "./api-client";
import type {
    ApiResponse,
    CreatePollRequest,
    CreatePollResponse,
    Poll,
    VoteRequest,
    VoteResponse,
} from "@/types/api";

export async function createPoll(
    data: CreatePollRequest
): Promise<CreatePollResponse> {
    const response = await apiClient.post<ApiResponse<CreatePollResponse>>(
        "/polls",
        data
    );
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error("Failed to create poll");
}

export async function fetchPoll(pollId: string): Promise<Poll> {
    const response = await apiClient.get<ApiResponse<Poll>>(`/polls/${pollId}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error("Failed to fetch poll");
}

export async function submitVote(data: VoteRequest): Promise<VoteResponse> {
    const response = await apiClient.post<ApiResponse<VoteResponse>>(
        "/votes",
        data
    );
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error("Failed to submit vote");
}
