import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { validateEnv } from "./env";
import { logger } from "../utils/logger";

const env = validateEnv();

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.NODE_ENV === "production" ? 5 : 10,
    min: 2,
    idleTimeoutMillis: 300000,
    connectionTimeoutMillis: 30000,
    allowExitOnIdle: false,
    ssl: { rejectUnauthorized: false },
});

pool.on("error", (err: Error) => {
    logger.error("Unexpected database pool error:", err);
});

pool.on("connect", () => {
    logger.log("New database connection established");
});

pool.on("remove", () => {
    logger.log("Database connection removed from pool");
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
