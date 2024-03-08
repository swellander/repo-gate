import { Address } from "viem";
import { client } from "~~/services/web3/client";
import erc20ABI from "~~/services/web3/erc20ABI.json";

const tokenAddress = process.env.TOKEN_ADDRESS || "";

export const requestToken = async (code: string) => {
  const tokenUrl = `/api/github-token?code=${code}`;
  const res = await fetch(tokenUrl);
  const data = await res.json();
  return data.access_token;
};

export const requestUser = async (token: string) => {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    method: "GET",
  });
  return res.json();
};

export const requestRepoInvite = async ({
  githubAccessToken,
  signature,
  installationId,
  repoName,
  repoOwner,
}: {
  githubAccessToken: string;
  signature: `0x${string}`;
  installationId: string;
  repoName: string;
  repoOwner: string;
}) => {
  const inviteUrl = `/api/invite`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: githubAccessToken,
      installation_id: installationId,
      repo: repoName,
      owner: repoOwner,
      signature,
    }),
  };
  const res = await fetch(inviteUrl, options);
  return res;
};

export const fetchGithubUserWithAccessToken = async (token: string) => {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    method: "GET",
  });
  return res.json();
};

export const addressOwnsAnyAmountOfToken = async (address: Address) => {
  const balance = await client.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return (balance as bigint) > 0n;
};
