import { z } from "zod";

export const createPostSchema = z.object({
  caption: z.string().max(2200, "Caption must be under 2200 characters").optional(),
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((f) => f.size <= 5 * 1024 * 1024, "Image must be under 5MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Only JPG, PNG, or WEBP allowed"
    ),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;