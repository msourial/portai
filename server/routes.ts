import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { getAuthLink, handleCallback } from "./services/twitter";
import { nanoid } from "nanoid";

declare module "express-session" {
  interface SessionData {
    codeVerifier?: string;
    state?: string;
    walletAddress?: string;
  }
}

export async function registerRoutes(app: Express) {
  // Twitter OAuth Routes
  app.get("/api/auth/twitter", async (req, res) => {
    try {
      const state = nanoid();
      const { url, codeVerifier } = await getAuthLink(state);

      req.session.codeVerifier = codeVerifier;
      req.session.state = state;
      req.session.walletAddress = req.query.walletAddress as string;

      console.log("Twitter auth initiated:", {
        state,
        walletAddress: req.query.walletAddress,
        url
      });

      res.json({ url });
    } catch (error) {
      console.error("Twitter auth error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate Twitter auth";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/auth/twitter/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      const { codeVerifier, state: savedState, walletAddress } = req.session;

      console.log("Twitter callback received:", {
        code: code ? "present" : "missing",
        state,
        savedState,
        walletAddress,
        codeVerifier: codeVerifier ? "present" : "missing"
      });

      if (!code) {
        throw new Error("No authorization code received from Twitter");
      }

      if (!codeVerifier) {
        throw new Error("No code verifier found in session");
      }

      if (state !== savedState) {
        throw new Error("State mismatch - possible security issue");
      }

      const { user } = await handleCallback(code as string, codeVerifier);

      try {
        const userData = insertUserSchema.parse({
          walletAddress,
          twitterHandle: user.username,
          telegramHandle: null
        });

        await storage.createUser(userData);
        res.redirect(`/dashboard/${walletAddress}`);
      } catch (error) {
        console.error("User creation error:", error);
        res.status(400).json({ error: "Invalid user data" });
      }
    } catch (error) {
      console.error("Twitter callback error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to complete Twitter authentication";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Add this endpoint to handle saving the API keys
  app.post("/api/config/twitter", async (req, res) => {
    try {
      const { apiKey, apiSecret } = req.body;

      if (!apiKey || !apiSecret) {
        res.status(400).json({ error: "API Key and Secret are required" });
        return;
      }

      // Store the API keys securely
      process.env.TWITTER_API_KEY = apiKey;
      process.env.TWITTER_API_SECRET = apiSecret;

      res.json({ message: "API keys saved successfully" });
    } catch (error) {
      console.error("Error saving Twitter API keys:", error);
      res.status(500).json({ error: "Failed to save API keys" });
    }
  });


  // Existing routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    const user = await storage.getUser(req.params.walletAddress);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  });

  app.post("/api/analyze", async (req, res) => {
    const schema = z.object({
      walletAddress: z.string(),
    });

    try {
      const { walletAddress } = schema.parse(req.body);
      const user = await storage.getUser(walletAddress);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Mock risk profile and recommendations
      const riskProfile = {
        score: Math.random() * 100,
        tolerance: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
        factors: ["Social media activity", "Transaction history", "Portfolio diversity"],
      };

      const recommendations = {
        assets: [
          {
            symbol: "ETH",
            name: "Ethereum",
            percentage: 40,
            reason: "Strong foundation for DeFi applications",
          },
          {
            symbol: "BTC",
            name: "Bitcoin",
            percentage: 30,
            reason: "Store of value with institutional adoption",
          },
          {
            symbol: "LINK",
            name: "Chainlink",
            percentage: 30,
            reason: "Essential oracle infrastructure",
          },
        ],
      };

      const updatedUser = await storage.updateUserAnalysis(
        walletAddress,
        riskProfile,
        recommendations
      );

      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  return createServer(app);
}