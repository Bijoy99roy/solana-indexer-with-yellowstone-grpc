# Solana Indexer using Yellowstone Grpc

# Initial Plan(v0)

- stream blocks
- Push into redis
- Fetch from resis
- Extract transactions
- Parse transactions
- Push to redis
- Stream to users via redis for near instant update
- Lazy update in db
