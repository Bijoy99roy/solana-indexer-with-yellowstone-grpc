import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("error", (err) => console.error("Redis client error: ", err));

redisClient.connect();

export { redisClient };
