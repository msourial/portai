import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .filter(line => line.trim() !== '' && !line.startsWith('#'))
      .forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });
    log("Environment variables loaded from .env file");
  }
} catch (error) {
  console.error("Error loading .env file:", error);
}

const app = express();
const SessionStore = MemoryStore(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "portfolai-session-secret",
  resave: false,
  saveUninitialized: false,
  store: new SessionStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: { secure: false } // set to true in production with HTTPS
}));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// Kill any existing process on port 5000
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') {
    log('Port 5000 is in use, attempting to close previous instance...');
    process.exit(1);
  } else {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  }
});

(async () => {
  try {
    // Verify X API credentials are loaded
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      log("Warning: X API credentials are missing");
    } else {
      log("X API credentials are configured");
    }

    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Server error:", err);
      res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
      });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = process.env.PORT || 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`Server running on port ${port}`);
      log(`X API Configuration: ${process.env.TWITTER_API_KEY ? 'Present' : 'Missing'}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();