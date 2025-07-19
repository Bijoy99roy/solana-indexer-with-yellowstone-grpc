import Client, {
  SubscribeRequest,
  CommitmentLevel,
  SubscribeRequestFilterAccounts,
  SubscribeRequestFilterTransactions,
  txEncode,
} from "@triton-one/yellowstone-grpc";
import msgpack from "msgpack-lite";

require("dotenv").config();
import bs58 from "bs58";
import { redisClient } from "./redis/redis";
import { redisConfig } from "./config/config";
import { parseTransactions } from "./parsers/parseTransactions";

const client = new Client(
  process.env.YELLOWSTONE_GRPC_URL!,
  undefined,
  undefined
);

async function startIndexer() {
  const version = await client.getVersion(); // gets the version information
  console.log(version);
  const stream = await client.subscribe();
  stream.on("data", async (data) => {
    console.log("data", data);
    console.log(
      "-----------------------------------------------------------------------------------------------------"
    );
    if (data.block) {
      console.log("Push");
      const encoded = msgpack.encode(data);
      console.log(encoded);
      await redisClient.lPush(redisConfig.queueName, JSON.stringify(data));
    }
  });
  stream.on("error", (err) => console.error("stream error:", err));
  //   const solendFilter: SubscribeRequestFilterTransactions = {
  //     serum: {
  //       vote: false,
  //     },
  // }
  //   };

  const request: SubscribeRequest = {
    slots: {},
    accounts: {},
    transactions: {
      alltxs: {
        vote: false,
        failed: false,
        signature: undefined,
        accountInclude: [],
        accountExclude: [],
        accountRequired: [],
      },
    },
    blocks: {
      blocks: {
        includeTransactions: true,
        includeAccounts: false,
        accountInclude: [],
      },
    },
    transactionsStatus: {},
    entry: {},
    blocksMeta: {},
    accountsDataSlice: [],
  };

  const request_radium: SubscribeRequest = {
    slots: {},
    accounts: {},
    transactions: {
      raydium: {
        accountInclude: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
        accountExclude: [],
        accountRequired: [],
      },
    },
    blocks: {},
    transactionsStatus: {},
    entry: {},
    blocksMeta: {},
    accountsDataSlice: [],
  };
  await new Promise<void>((resolve, reject) => {
    stream.write(request, (err: Error) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });
}

startIndexer();
