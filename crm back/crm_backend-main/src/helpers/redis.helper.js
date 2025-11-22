const redis = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = redis.createClient({
  url: redisUrl,
  socket: redisUrl.startsWith("rediss://") ? { tls: true } : {},
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.error("Redis connection failed:", error.message);
  }
})();

// Store JWT with expiry (default 1 hour)
const setJWT = async (key, value, ttl = 3600) => {
  try {
    return await client.set(key, value, { EX: ttl });
  } catch (err) {
    console.error("Error setting JWT in Redis:", err.message);
    return null;
  }
};

const getJWT = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    console.error("Error getting JWT from Redis:", err.message);
    return null;
  }
};

const deleteJWT = async (key) => {
  try {
    return await client.del(key);
  } catch (err) {
    console.error("Error deleting JWT from Redis:", err.message);
    return null;
  }
};

module.exports = { setJWT, getJWT, deleteJWT };
