import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { query } from "./database";
import { logger } from "../utils/logger";

async function migrate(): Promise<void> {
    try {
        const schemaPath = join(__dirname, "schema.sql");
        const schema = readFileSync(schemaPath, "utf-8");

        await query(schema);

        logger.info("Database migration completed successfully");
        process.exit(0);
    } catch (error) {
        logger.error("Migration failed:", error);
        process.exit(1);
    }
}

void migrate();
