import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { connectMongoDB } from "./config/database";
import { redis } from "./config/redis";
import { setupWebSocket } from "./websocket";
import { startWorker } from "./services/queue/worker";
import apiRoutes from "./routes";

const isProduction = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || "4000", 10);

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: isProduction
      ? process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim())
      : "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", apiRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// WebSocket
setupWebSocket(server);

async function start() {
  await connectMongoDB();

  // In dev, ping ioredis to verify connection; Upstash REST doesn't need a ping
  if (!isProduction) {
    const ioRedis = redis as import("ioredis").default;
    await ioRedis.ping();
  }

  // Start BullMQ worker
  startWorker();

  server.listen(PORT, () => {
    console.log(`🚀 VedaAI backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export { app, server };
