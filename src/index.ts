import Client, {
  SubscribeRequest,
  CommitmentLevel,
  SubscribeRequestFilterAccounts,
  SubscribeRequestFilterTransactions,
  txEncode,
} from "@triton-one/yellowstone-grpc";
require("dotenv").config();
import bs58 from "bs58";
console.log(process.env.YELLOWSTONE_GRPC_URL);
const client = new Client(
  process.env.YELLOWSTONE_GRPC_URL!,
  undefined,
  undefined
);

async function startIndexer() {
  const version = await client.getVersion(); // gets the version information
  console.log(version);
  const stream = await client.subscribe();
  stream.on("data", (data) => {
    console.log("data", data);
    console.log(
      "-----------------------------------------------------------------------------------------------------"
    );
    if (data.block) {
      if (data.block.transactions.length) {
        for (let i = 0; i < data.block.transactions.length - 1; i++) {
          // Filter out non vote transactions
          if (!data.block.transactions[i].isVote) {
            console.log(
              "Signature",
              bs58.encode(data.block.transactions[i].signature)
            );
            console.log(
              "Trnasaction Signature",
              bs58.encode(data.block.transactions[i].transaction.signatures[0])
            );
            console.log(
              "HEADER",
              data.block.transactions[i].transaction.message.header
            );
            for (
              let j = 0;
              j <
              data.block.transactions[i].transaction.message.accountKeys.length;
              j++
            ) {
              console.log(
                "ACCOUNT KEYS",
                bs58.encode(
                  data.block.transactions[i].transaction.message.accountKeys[j]
                )
              );
            }

            console.log(
              "INSTRUNCTIONS ACCOUNTS",
              bs58.encode(
                data.block.transactions[i].transaction.message.instructions[0]
                  .accounts
              )
            );
            console.log(
              "INSTRUNCTIONS DATA",
              bs58.encode(
                data.block.transactions[i].transaction.message.instructions[0]
                  .data
              )
            );
            console.log("transaction", data.block.transactions[i]);
            const tx = txEncode.encode(
              data.block.transactions[i],
              txEncode.encoding.Json,
              255,
              true
            );
            console.log(`tx: ${JSON.stringify(tx)}`);
          }
        }
      }
    }
    console.log(
      "********************************************************************************************************"
    );
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
