import { validateEnv } from "../config/env";

const env = validateEnv();

class Logger {
    private isDevelopment = env.NODE_ENV === "development";

    log(message: string, data?: unknown): void {
        if (this.isDevelopment) {
            // eslint-disable-next-line no-console
            console.log(message, data ?? "");
        }
    }

    error(message: string, error?: unknown): void {
        // eslint-disable-next-line no-console
        console.error(message, error ?? "");
    }

    warn(message: string, data?: unknown): void {
        if (this.isDevelopment) {
            // eslint-disable-next-line no-console
            console.warn(message, data ?? "");
        }
    }

    info(message: string, data?: unknown): void {
        // eslint-disable-next-line no-console
        console.log(message, data ?? "");
    }
}

export const logger = new Logger();
