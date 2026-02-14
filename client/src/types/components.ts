/**
 * Component Props Interfaces
 */

import type { CreatePollRequest, Poll, VoteUpdate } from "./api";

export interface PollFormProps {
    onSubmit: (data: CreatePollRequest) => Promise<void>;
    isLoading?: boolean;
}

export interface PollRoomProps {
    initialData: Poll;
}

export interface VoteResultsProps {
    options: Poll["options"];
    totalVotes: number;
    hasVoted: boolean;
}

export interface ShareLinkCardProps {
    pollId: string;
}

export interface PollOptionItemProps {
    option: Poll["options"][0];
    totalVotes: number;
    isSelected: boolean;
    hasVoted: boolean;
    isUserSelection?: boolean;
    onSelect: (optionId: string) => void;
}
