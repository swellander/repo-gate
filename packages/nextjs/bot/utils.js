class RepoGate {
  constructor(context, repoData) {
    this.context = context;
    this.repoData = repoData;
  }

  addDefaultConfig() {
    const configContent = `# Configuration for Repo Gate\nrepoGate:\n  chainId: ${process.env.DEFAULT_CHAIN_ID}\n  tokenAddress: '${process.env.DEFAULT_TOKEN_ADDRESS}'`;
    this.createOrUpdateFile({
      path: ".github/config.yml",
      content: configContent,
    });
  }

  addInviteLink() {
    const [owner, repo] = this.repoData.full_name.split("/");
    const inviteLink = `${process.env.FRONTEND_HOST}?owner=${owner}&repo=${repo}&installation_id=${this.context.payload.installation.id}`;

    this.createOrUpdateFile({
      path: "README.md",
      content: `# [Get Collab Invite](${inviteLink})`,
    });
  }

  async createOrUpdateFile({ path, content }) {
    const [owner, repo] = this.repoData.full_name.split("/");

    let existingFile;
    try {
      existingFile = await this.context.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
    } catch (error) {
      if (error.status === 404) {
        existingFile = null;
      } else {
        console.error(`Error retrieving ${path} for ${owner}/${repo}:`, error);
      }
    }

    let newContent;
    if (existingFile) {
      const existingContent = Buffer.from(existingFile.data.content, "base64").toString();
      newContent = `${existingContent}\n\n${content}\n`;
    } else {
      newContent = content;
    }

    const message = existingFile ? `Update ${path}` : `Create ${path}`;
    const base64Content = Buffer.from(newContent).toString("base64");

    const committer = {
      name: "repo-gate-bot",
      email: "repogate@gmail.com",
    };

    try {
      await this.context.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: base64Content,
        committer,
        sha: existingFile ? existingFile.data.sha : undefined,
      });
      console.log(`${existingFile ? "Updated" : "Created"} ${path} for ${owner}/${repo}`);
    } catch (error) {
      console.error(`Error updating/creating ${path} for ${owner}/${repo}:`, error);
    }
  }
}

const handleNewRepo = async ({ context, repoData }) => {
  const repoGate = new RepoGate(context, repoData);
  repoGate.addDefaultConfig();
  repoGate.addInviteLink();
};

module.exports = { handleNewRepo };
