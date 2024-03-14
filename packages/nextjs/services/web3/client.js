import { createPublicClient, http } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

const supportedChains = [arbitrum, base, mainnet, optimism, polygon];

export const getClient = id => {
  const chain = supportedChains.find(c => c.id === id);
  const client = createPublicClient({
    chain,
    transport: http(),
  });
  return client;
};
