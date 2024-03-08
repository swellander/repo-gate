module.exports = app => {
  app.on("installation_repositories", async context => {
    for (const addedRepo of context.payload.repositories_added) {
      const [owner, repo] = addedRepo.full_name.split("/");

      let existingReadme;
      try {
        existingReadme = await context.octokit.rest.repos.getContent({
          owner,
          repo,
          path: "README.md",
        });
      } catch (error) {
        if (error.status === 404) {
          existingReadme = null;
        } else {
          console.error(`Error retrieving README.md for ${owner}/${repo}:`, error);
          continue;
        }
      }

      const generatedInviteLink = `https://repogate.vercel.app?owner=${owner}&repo=${repo}&installation_id=${context.payload.installation.id}`;

      let newContent;
      if (existingReadme) {
        const existingContent = Buffer.from(existingReadme.data.content, "base64").toString();
        newContent = `${existingContent}\n\n# [Get Collab Invite](${generatedInviteLink})`;
      } else {
        newContent = `# [Get Collab Invite](${generatedInviteLink})`;
      }

      const message = existingReadme ? "Update README.md" : "Create README.md";
      const content = Buffer.from(newContent).toString("base64");

      const committer = {
        name: "token-gate-bot",
        email: "repotokengate@gmail.com",
      };

      try {
        await context.octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: "README.md",
          message,
          content,
          committer,
          sha: existingReadme ? existingReadme.data.sha : undefined,
        });
        console.log(`${existingReadme ? "Updated" : "Created"} readme for ${owner}/${repo}`);
      } catch (error) {
        console.error(`Error updating/creating README.md for ${owner}/${repo}:`, error);
      }
    }
  });
};
