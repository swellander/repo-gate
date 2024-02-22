const erc20ABI = require("./erc20ABI.json");
const { client } = require("./client");

const fetchGithubUserWithAccessToken = async (token) => {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    method: "GET",
  });
  return res.json();
};

const addressOwnsAnyAmountOfToken = async (address) => {
  const balance = await client.readContract({
    address: process.env.TOKEN_ADDRESS,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return balance > 0;
};

module.exports = {
  fetchGithubUserWithAccessToken,
  addressOwnsAnyAmountOfToken,
};
