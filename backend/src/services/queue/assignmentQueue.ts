import { Queue } from "bullmq";
import { getRedisConnection } from "../../config/redis";

const connection = getRedisConnection();

export const assignmentQueue = new Queue("assignment-generation", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
    },
    removeOnFail: {
      count: 50,
    },
  },
});

console.log("✅ BullMQ assignment queue initialized");
