import type { Server, Socket } from "socket.io";
import { logger } from "../utils/logger";

export function setupPollSocket(io: Server): void {
    io.on("connection", (socket: Socket) => {
        logger.log(`Client connected: ${socket.id}`);

        // Join poll room
        socket.on("join_poll_room", (pollId: string) => {
            if (typeof pollId === "string" && pollId.length > 0) {
                void socket.join(pollId);
                logger.log(`Client ${socket.id} joined poll room: ${pollId}`);
            }
        });

        // Leave poll room
        socket.on("leave_poll_room", (pollId: string) => {
            if (typeof pollId === "string" && pollId.length > 0) {
                void socket.leave(pollId);
                logger.log(`Client ${socket.id} left poll room: ${pollId}`);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            logger.log(`Client disconnected: ${socket.id}`);
        });

        // Handle connection errors
        socket.on("error", (error: Error) => {
            logger.error(`Socket error for ${socket.id}:`, error);
        });
    });
}
