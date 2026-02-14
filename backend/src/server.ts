import "dotenv/config";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";
import { validateEnv } from "./config/env";
import { closePool } from "./config/database";
import { setupPollSocket } from "./sockets/poll.socket";
import { logger } from "./utils/logger";

const env = validateEnv();
const PORT = parseInt(env.PORT, 10);

// Create HTTP server
const server = http.createServer();

// Create Socket.IO server
const io = new SocketIOServer(server, {
    cors: {
        origin: env.FRONTEND_URL,
        credentials: true,
    },
    transports: ["websocket", "polling"],
});

// Set up Socket.IO event handlers
setupPollSocket(io);

// Create Express app with Socket.IO instance
const app = createApp(io);

// Attach Express app to HTTP server
server.on("request", app);

// Start server
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`Frontend URL: ${env.FRONTEND_URL}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        logger.info("HTTP server closed");
        closePool()
            .then(() => {
                logger.info("Database pool closed");
                process.exit(0);
            })
            .catch((error) => {
                logger.error("Error closing database pool:", error);
                process.exit(1);
            });
    });
});

process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    server.close(() => {
        logger.info("HTTP server closed");
        closePool()
            .then(() => {
                logger.info("Database pool closed");
                process.exit(0);
            })
            .catch((error) => {
                logger.error("Error closing database pool:", error);
                process.exit(1);
            });
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
    logger.error("Unhandled Rejection at:", { promise, reason });
    process.exit(1);
});
