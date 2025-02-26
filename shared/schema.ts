import { pgTable, text, serial, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  // Social Media Handles
  twitterHandle: text("twitter_handle"),
  telegramHandle: text("telegram_handle"),
  discordHandle: text("discord_handle"),
  linkedinHandle: text("linkedin_handle"),
  redditHandle: text("reddit_handle"),
  githubHandle: text("github_handle"),
  tiktokHandle: text("tiktok_handle"),
  instagramHandle: text("instagram_handle"),
  facebookHandle: text("facebook_handle"),
  youtubeHandle: text("youtube_handle"),

  // Analysis Results
  riskProfile: json("risk_profile").$type<{
    score: number;
    tolerance: "low" | "medium" | "high";
    factors: string[];
  }>(),
  recommendations: json("recommendations").$type<{
    assets: Array<{
      symbol: string;
      name: string;
      percentage: number;
      reason: string;
    }>;
  }>(),
});

// Schema for creating a new user - all fields except id are optional
const baseSchema = z.object({
  walletAddress: z.string().nullish(),
  twitterHandle: z.string().nullish(),
  telegramHandle: z.string().nullish(),
  discordHandle: z.string().nullish(),
  linkedinHandle: z.string().nullish(),
  redditHandle: z.string().nullish(),
  githubHandle: z.string().nullish(),
  tiktokHandle: z.string().nullish(),
  instagramHandle: z.string().nullish(),
  facebookHandle: z.string().nullish(),
  youtubeHandle: z.string().nullish(),
});

export const insertUserSchema = baseSchema.refine((data) => {
  // Ensure at least one field has a value
  return Object.values(data).some(value => value !== null && value !== undefined);
}, {
  message: "At least one social media handle or wallet address must be provided"
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;