const axios = require("axios");
const cors = require("cors");
const express = require("express");
const { ProbotOctokit } = require("probot");
const { recoverMessageAddress } = require("viem");
const {
  fetchGithubUserWithAccessToken,
  addressOwnsAnyAmountOfToken,
} = require("./utils");

module.exports = (app, { getRouter }) => {
  const router = getRouter("/token-gate");
  router.use(express.json());
  router.use(cors());

  app.on("installation_repositories", async (context) => {
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
          console.error(
            `Error retrieving README.md for ${owner}/${repo}:`,
            error
          );
          continue;
        }
      }

      const generatedInviteLink = `${process.env.FRONTEND_HOST}?owner=${owner}&repo=${repo}&installation_id=${context.payload.installation.id}`;

      let newContent;
      if (existingReadme) {
        const existingContent = Buffer.from(
          existingReadme.data.content,
          "base64"
        ).toString();
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
        console.log(
          `${
            existingReadme ? "Updated" : "Created"
          } readme for ${owner}/${repo}`
        );
      } catch (error) {
        console.error(
          `Error updating/creating README.md for ${owner}/${repo}:`,
          error
        );
      }
    }
  });

  router.get("/token", (req, res) => {
    axios
      .post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
          client_secret: GITHUB_OAUTH_CLIENT_SECRET,
          code: req.query.code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((axiosResponse) => {
        res.send(axiosResponse.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send("Error exchanging tokens");
      });
  });

  router.post("/invite", async (req, res) => {
    const { installation_id, access_token, signature, repo, owner } = req.body;

    // get user from access_token
    const user = await fetchGithubUserWithAccessToken(access_token);
    const username = user.login;

    const address = await recoverMessageAddress({
      message: process.env.MESSAGE_TO_SIGN,
      signature,
    });

    if (await addressOwnsAnyAmountOfToken(address)) {
      // send invite
      const octokit = new ProbotOctokit({
        auth: {
          appId: app.state.appId,
          privateKey: app.state.privateKey,
          installationId: installation_id,
        },
      });

      await octokit.rest.repos.addCollaborator({
        owner: owner,
        repo: repo,
        username: username,
        permission: "write",
      });
      console.log(
        `User ${username} invited as a collaborator to ${owner}/${repo}`
      );
      res.sendStatus(201);
    } else {
      console.log(`User ${username}:${address} does not have token`);
      res.sendStatus(404);
    }
  });
};
