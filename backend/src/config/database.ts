import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { validateEnv } from "./env";
import { logger } from "../utils/logger";

const env = validateEnv();

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.NODE_ENV === "production" ? 3 : 10,
    min: 1,
    idleTimeoutMillis: 120000,
    connectionTimeoutMillis: 30000,
    allowExitOnIdle: false,
    ssl: env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: false },
});

pool.on("error", (err: Error) => {
    logger.error("Unexpected database error:", err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> {
    const start = Date.now();
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (env.NODE_ENV === "development") {
        logger.log("Executed query", { text, duration, rows: res.rowCount });
    }

    return res;
}

export async function getClient(): Promise<PoolClient> {
    return await pool.connect();
}

export async function closePool(): Promise<void> {
    await pool.end();
}

export default pool;
