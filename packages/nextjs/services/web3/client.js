import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

export const client = createPublicClient({
  chain: polygon,
  transport: http(),
});
