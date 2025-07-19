import { SubscribeRequest } from "@triton-one/yellowstone-grpc";

export function getAllTransactionSchema(): SubscribeRequest {
  return {
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
}
