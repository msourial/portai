import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { simulateAnalysis } from "../client/src/lib/mockOortAI";
import { oortAI } from "./services/oortai";

export async function registerRoutes(app: Express) {
  // User management routes
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
    try {
      let user = await storage.getUser(req.params.walletAddress);

      // If user doesn't exist or doesn't have analysis, create mock analysis
      if (!user || (!user.riskProfile && !user.recommendations)) {
        const mockAnalysis = await simulateAnalysis(req.params.walletAddress);

        // Create user if doesn't exist
        if (!user) {
          user = await storage.createUser({
            walletAddress: req.params.walletAddress,
          });
        }

        // Update with mock analysis
        user = await storage.updateUserAnalysis(
          req.params.walletAddress,
          mockAnalysis.riskProfile,
          mockAnalysis.recommendations
        );
      }

      res.json(user);
    } catch (error) {
      console.error("Error getting user data:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const message = z.string().parse(req.body.message);
      const response = await oortAI.handleChat(message);
      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({ error: "Invalid chat message" });
    }
  });

  return createServer(app);
}