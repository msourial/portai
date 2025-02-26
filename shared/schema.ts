import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  twitterHandle: text("twitter_handle").notNull(),
  telegramHandle: text("telegram_handle").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  twitterHandle: true,
  telegramHandle: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
