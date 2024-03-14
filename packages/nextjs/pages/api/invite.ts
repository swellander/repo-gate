import type { NextApiRequest, NextApiResponse } from "next";
import { recoverMessageAddress } from "viem";
import { getOctokit } from "~~/services/octokit";
import { fetchConfig } from "~~/services/octokit/getConfig";
import { addressOwnsAnyAmountOfToken, fetchGithubUserWithAccessToken } from "~~/utils/scaffold-eth/probot";

const messageToSign = process.env.MESSAGE_TO_SIGN || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { installation_id, access_token, signature, repo, owner } = req.body;

  // get user from access_token
  const user = await fetchGithubUserWithAccessToken(access_token);
  const username = user.login;

  const address = await recoverMessageAddress({
    message: messageToSign,
    signature,
  });
  const config = await fetchConfig({
    owner,
    repo,
    installationId: installation_id
  })

  if (await addressOwnsAnyAmountOfToken({
    owner: address,
    tokenAddress: config.tokenAddress,
    chainId: config.chainId
  })) {
    // send invite
    const octokit = getOctokit(installation_id);
    await octokit.rest.repos.addCollaborator({
      owner: owner,
      repo: repo,
      username: username,
      permission: "push",
    });
    console.log(`User ${username} invited as a collaborator to ${owner}/${repo}`);
    res.status(201).end();
  } else {
    console.log(`User ${username}:${address} does not have token ${config.tokenAddress} on chain ${config.chainId}`);
    res.status(404).end();
  }
}
