import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  phone: z.string().optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;