import { txEncode } from "@triton-one/yellowstone-grpc";
import { decodeTransact } from "./txnDecoder";
function reviveBuffer(value: any) {
  if (value && value.type === "Buffer" && Array.isArray(value.data)) {
    console.log(value);
    return Buffer.from(value.data);
  }
}
export async function parseTransactions(data: any) {
  try {
    if (data.block.transactions.length) {
      for (let i = 0; i < data.block.transactions.length - 1; i++) {
        // Filter out non vote transactions
        if (!data.block.transactions[i].isVote) {
          data.block.transactions[i].signature = reviveBuffer(
            data.block.transactions[i].signature
          );
          //   console.log(
          //     "Signature",
          //     decodeTransact(data.block.transactions[i].signature)
          //   );
          //   console.log(
          //     "Trnasaction Signature",
          //     decodeTransact(data.block.transactions[i].transaction.signatures[0])
          //   );
          //   console.log(
          //     "HEADER",
          //     data.block.transactions[i].transaction.message.header
          //   );
          //   for (
          //     let j = 0;
          //     j <
          //     data.block.transactions[i].transaction.message.accountKeys.length;
          //     j++
          //   ) {
          //     console.log(
          //       "ACCOUNT KEYS",
          //       decodeTransact(
          //         data.block.transactions[i].transaction.message.accountKeys[j]
          //       )
          //     );
          //   }
          //   console.log(
          //     "INSTRUNCTIONS ACCOUNTS",
          //     decodeTransact(
          //       data.block.transactions[i].transaction.message.instructions[0]
          //         .accounts
          //     )
          //   );
          //   console.log(
          //     "INSTRUNCTIONS DATA",
          //     decodeTransact(
          //       data.block.transactions[i].transaction.message.instructions[0]
          //         .data
          //     )
          //   );
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
  } catch (error) {
    console.log("Error occured while parsing data", error);
  }
}
