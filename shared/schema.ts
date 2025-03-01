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
  return Object.values(data).some((value) => value !== null && value !== undefined);
}, {
  message: "At least one social media handle or wallet address must be provided",
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


// Social Media Analysis Types
export const socialMediaAnalysisSchema = z.object({
  platform: z.string(),
  sentiment: z.number().min(-1).max(1),
  interests: z.array(z.string()),
  riskTolerance: z.number().min(0).max(100),
  tradingExperience: z.number().min(0).max(100),
  engagementMetrics: z.object({
    interaction_frequency: z.number(),
    content_quality: z.number(),
    influence_score: z.number(),
  }),
  contentAnalysis: z.object({
    topics: z.array(z.string()),
    sentiment_patterns: z.array(z.string()),
    market_knowledge: z.number().min(0).max(100),
  }),
});

export type SocialMediaAnalysis = z.infer<typeof socialMediaAnalysisSchema>;

// Wallet Analysis Types
export const walletAnalysisSchema = z.object({
  transactionVolume: z.number().min(0),
  holdingPeriod: z.number().min(0),
  diversification: z.number().min(0).max(100),
  riskLevel: z.number().min(0).max(100),
  behavioralMetrics: z.object({
    buyBehavior: z.object({
      timing_score: z.number().min(0).max(100),
      size_consistency: z.number().min(0).max(100),
      frequency_pattern: z.number().min(0).max(100),
    }),
    sellBehavior: z.object({
      profit_taking: z.number().min(0).max(100),
      loss_handling: z.number().min(0).max(100),
      rebalancing_frequency: z.number().min(0).max(100),
    }),
  }),
});

export type WalletAnalysis = z.infer<typeof walletAnalysisSchema>;

// Investment Recommendation Types
export const assetRecommendationSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  type: z.enum(['stock', 'bond', 'crypto', 'commodity', 'alternative']),
  allocation: z.number().min(0).max(100),
  riskScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  reason: z.string(),
});

export const portfolioRecommendationSchema = z.object({
  riskProfile: z.object({
    score: z.number().min(0).max(100),
    tolerance: z.enum(['low', 'medium', 'high']),
    factors: z.array(z.string()),
    confidence: z.number().min(0).max(100),
  }),
  assets: z.array(assetRecommendationSchema),
  rebalancingFrequency: z.enum(['monthly', 'quarterly', 'threshold_based']),
  nextReview: z.string().datetime(),
});

export type AssetRecommendation = z.infer<typeof assetRecommendationSchema>;
export type PortfolioRecommendation = z.infer<typeof portfolioRecommendationSchema>;