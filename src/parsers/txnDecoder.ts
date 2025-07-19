import bs58 from "bs58";
export function decodeTransact(data: any) {
  console.log(data);
  const output = data ? bs58.encode(Buffer.from(data)) : "";
  return output;
}
