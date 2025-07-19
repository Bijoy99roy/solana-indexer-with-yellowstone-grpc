import { redisConfig } from "./config/config";
import { parseTransactions } from "./parsers/parseTransactions";
import { redisClient } from "./redis/redis";

export async function redisConsumer() {
  try {
    while (true) {
      const txnDataRaw = await redisClient.brPop(redisConfig.queueName, 0);
      if (txnDataRaw) {
        try {
          const txnData = JSON.parse(txnDataRaw.element);
          console.log("STraight from redis");

          console.log(txnData);
          await parseTransactions(txnData);
        } catch (error) {
          console.error("Failed to process transaction", error);
        }
      }
    }
  } catch (error) {
    console.error("Failed to connect to redis");
  }
}

redisConsumer();
