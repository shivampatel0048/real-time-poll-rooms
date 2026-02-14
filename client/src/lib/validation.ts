import { z } from "zod";

export const createPollSchema = z.object({
    question: z
        .string()
        .min(5, "Question must be at least 5 characters")
        .max(500, "Question must not exceed 500 characters"),
    options: z
        .array(z.string().min(1, "Option cannot be empty").max(200))
        .min(2, "At least 2 options required")
        .max(10, "Maximum 10 options allowed"),
});

export type CreatePollFormData = z.infer<typeof createPollSchema>;
