import { ProbotOctokit } from "probot";

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY;

export const getOctokit = (installationId: number) =>
  new ProbotOctokit({
    auth: {
      appId: appId,
      privateKey: privateKey,
      installationId,
    },
  });
