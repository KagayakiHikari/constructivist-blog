import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(64),
  password: z.string().min(1, "Password is required").max(128)
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-zA-Z0-9\p{Script=Han}-]+$/u, "Slug contains invalid characters")
    .optional()
    .or(z.literal("")),
  summary: z.string().trim().max(500).default(""),
  contentMarkdown: z.string().max(1_000_000).default(""),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  tags: z.array(z.string().trim().min(1).max(32)).max(12).default([])
});

export type PostInput = z.infer<typeof postSchema>;
