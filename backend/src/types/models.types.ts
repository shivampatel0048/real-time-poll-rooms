export interface Poll {
    id: string;
    question: string;
    created_at: Date;
}

export interface PollOption {
    id: string;
    poll_id: string;
    text: string;
    vote_count: number;
}

export interface Vote {
    id: string;
    poll_id: string;
    option_id: string;
    voter_token: string;
    ip_address: string | null;
    created_at: Date;
}

export interface PollWithOptions extends Poll {
    options: PollOption[];
    totalVotes: number;
}
