import { query, getClient } from "../config/database";
import type { Vote } from "../types/models.types";

interface CreateVoteParams {
    pollId: string;
    optionId: string;
    voterToken: string;
    ipAddress?: string | null;
}

export async function createVote(params: CreateVoteParams): Promise<Vote> {
    const client = await getClient();

    try {
        await client.query("BEGIN");

        // Insert vote (will fail if duplicate due to unique constraint)
        const voteResult = await client.query<Vote>(
            `
      INSERT INTO votes (poll_id, option_id, voter_token, ip_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
            [params.pollId, params.optionId, params.voterToken, params.ipAddress ?? null]
        );

        const vote = voteResult.rows[0];
        if (!vote) {
            throw new Error("Failed to create vote");
        }

        // Increment vote count atomically
        await client.query(
            "UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = $1",
            [params.optionId]
        );

        await client.query("COMMIT");

        return vote;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function hasVoted(pollId: string, voterToken: string): Promise<boolean> {
    const result = await query<{ exists: boolean }>(
        "SELECT EXISTS(SELECT 1 FROM votes WHERE poll_id = $1 AND voter_token = $2) as exists",
        [pollId, voterToken]
    );

    return result.rows[0]?.exists ?? false;
}

export async function getVoteByPollAndToken(
    pollId: string,
    voterToken: string
): Promise<Vote | null> {
    const result = await query<Vote>(
        "SELECT * FROM votes WHERE poll_id = $1 AND voter_token = $2",
        [pollId, voterToken]
    );

    return result.rows[0] ?? null;
}
