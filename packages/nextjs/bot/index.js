const { handleNewRepo } = require("./utils");

module.exports = app => {
  app.on("installation", async context => {
    for (const repoData of context.payload.repositories) {
      handleNewRepo({
        context,
        repoData,
      });
    }
  });
  app.on("installation_repositories", async context => {
    for (const repoData of context.payload.repositories_added) {
      handleNewRepo({
        context,
        repoData,
      });
    }
  });
};
