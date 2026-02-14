import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { validateEnv } from "./config/env";
import { generalLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import pollRoutes from "./routes/poll.routes";
import healthRoutes from "./routes/health.routes";
import { createVoteRoutes } from "./routes/vote.routes";
import type { Server as SocketIOServer } from "socket.io";

const env = validateEnv();

export function createApp(io: SocketIOServer): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(
        cors({
            origin: env.FRONTEND_URL,
            credentials: true,
        })
    );

    // Compression
    app.use(compression());

    // Body parsing
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Cookie parsing
    app.use(cookieParser());

    // Rate limiting
    app.use(generalLimiter);

    // API routes
    app.use("/api", healthRoutes);
    app.use("/api", pollRoutes);
    app.use("/api", createVoteRoutes(io));

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
}
