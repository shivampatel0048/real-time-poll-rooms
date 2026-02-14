import { query, getClient } from "../config/database";
import type { Poll, PollOption, PollWithOptions } from "../types/models.types";

interface CreatePollParams {
    question: string;
    options: string[];
}

export async function createPoll(params: CreatePollParams): Promise<PollWithOptions> {
    const client = await getClient();

    try {
        await client.query("BEGIN");

        // Create poll
        const pollResult = await client.query<Poll>(
            "INSERT INTO polls (question) VALUES ($1) RETURNING *",
            [params.question]
        );

        const poll = pollResult.rows[0];
        if (!poll) {
            throw new Error("Failed to create poll");
        }

        // Create poll options
        const optionPromises = params.options.map((optionText) =>
            client.query<PollOption>(
                "INSERT INTO poll_options (poll_id, text) VALUES ($1, $2) RETURNING *",
                [poll.id, optionText]
            )
        );

        const optionResults = await Promise.all(optionPromises);
        const options = optionResults.map((result: { rows: PollOption[] }) => result.rows[0]!);

        await client.query("COMMIT");

        return {
            ...poll,
            options,
            totalVotes: 0,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function findPollById(pollId: string): Promise<PollWithOptions | null> {
    const result = await query<Poll & { options: string; total_votes: string }>(
        `
    SELECT 
      p.id, 
      p.question, 
      p.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', po.id, 
            'text', po.text, 
            'vote_count', po.vote_count,
            'poll_id', po.poll_id
          ) ORDER BY po.text
        ) FILTER (WHERE po.id IS NOT NULL),
        '[]'
      ) as options,
      COALESCE(SUM(po.vote_count), 0) as total_votes
    FROM polls p
    LEFT JOIN poll_options po ON p.id = po.poll_id
    WHERE p.id = $1
    GROUP BY p.id
    `,
        [pollId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const row = result.rows[0]!;

    const parsedOptions = typeof row.options === "string"
        ? (JSON.parse(row.options) as PollOption[])
        : (row.options as unknown as PollOption[]);

    return {
        id: row.id,
        question: row.question,
        created_at: row.created_at,
        options: parsedOptions,
        totalVotes: parseInt(row.total_votes, 10),
    };
}

export async function findPollOptionById(optionId: string): Promise<PollOption | null> {
    const result = await query<PollOption>(
        "SELECT * FROM poll_options WHERE id = $1",
        [optionId]
    );

    return result.rows[0] ?? null;
}
