import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

const isProduction = process.env.NODE_ENV === "production";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

/**
 * General-purpose Redis client.
 * - Production: Upstash REST client (serverless-friendly)
 * - Development: ioredis (local Redis)
 */
export const redis: UpstashRedis | IORedis = isProduction
  ? new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : (() => {
      const client = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });
      client.on("connect", () => console.log("✅ Redis connected"));
      client.on("error", (err) => console.error("❌ Redis error:", err.message));
      return client;
    })();

/**
 * BullMQ always requires an ioredis-compatible connection (not Upstash REST).
 * In production, connect via the Upstash TLS Redis endpoint.
 */
export function getRedisConnection(): IORedis {
  if (isProduction) {
    return new IORedis(process.env.REDIS_TLS_URL!, {
      tls: { rejectUnauthorized: false },
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }
  return new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export default redis;

