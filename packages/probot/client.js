const { createPublicClient, http } = require("viem");
const { polygon } = require("viem/chains");

const client = createPublicClient({
  chain: polygon,
  transport: http(),
});

module.exports = { client };
