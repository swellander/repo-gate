import type { NextApiRequest, NextApiResponse } from "next";
import { ProbotOctokit } from "probot";
import { recoverMessageAddress } from "viem";
import { addressOwnsAnyAmountOfToken, fetchGithubUserWithAccessToken } from "~~/utils/scaffold-eth/probot";

const messageToSign = process.env.MESSAGE_TO_SIGN || "";
const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { installation_id, access_token, signature, repo, owner } = req.body;

  // get user from access_token
  const user = await fetchGithubUserWithAccessToken(access_token);
  const username = user.login;

  const address = await recoverMessageAddress({
    message: messageToSign,
    signature,
  });

  if (await addressOwnsAnyAmountOfToken(address)) {
    // send invite
    const octokit = new ProbotOctokit({
      auth: {
        appId: appId,
        privateKey: privateKey,
        installationId: installation_id,
      },
    });

    await octokit.rest.repos.addCollaborator({
      owner: owner,
      repo: repo,
      username: username,
      permission: "push",
    });
    console.log(`User ${username} invited as a collaborator to ${owner}/${repo}`);
    res.status(201).end();
  } else {
    console.log(`User ${username}:${address} does not have token`);
    res.status(404).end();
  }
}
