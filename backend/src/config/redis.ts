import Redis from "ioredis";

const REDIS_URI = process.env.REDIS_URI as string;

if (!REDIS_URI) {
  console.error("FATAL ERROR: REDIS_URI is missing from .env configuration!");
  process.exit(1);
}

const redisClient = new Redis(REDIS_URI);

redisClient.on("connect", () => {
  console.log(`Redis connected to ${REDIS_URI.split("@")[1] || "Localhost"}`);
});

redisClient.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});

export default redisClient;
