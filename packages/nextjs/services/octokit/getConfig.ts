import { getOctokit } from ".";
import { parse } from "yaml";

export const fetchConfig = async ({
  owner,
  repo,
  installationId,
}: {
  owner: string;
  repo: string;
  installationId: number;
}) => {
  const octokit = getOctokit(installationId);
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: ".github/config.yml",
    });

    // @ts-ignore:
    const content = Buffer.from(response.data.content, response.data.encoding).toString();

    try {
      const { repoGate: config } = parse(content);
      if (!config) throw new Error(".github/config.yml is invalid");
      return config;
    } catch (err) {
      throw new Error(".github/config.yml is invalid");
    }
  } catch (error) {
    console.error("Error fetching config file:", error);
    return null;
  }
};
