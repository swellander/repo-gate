# Token Gate Bot

> Auto-invite users to a repo if they own a particular token

## How it Works

When a repo admin installs Token Gate as a Github App on their repo, the bot will immediately a custom link to the project Readme. When a prospective user visits the repo, they can click the `Get Collab Invite` link and be prompted to sign a message, proving they own some [SPORK Token](https://polygonscan.com/token/0x9ca6a77c8b38159fd2da9bd25bc3e259c33f5e39). If the user does own the token, they will be automatically invited as a collaborator with `write` access to the repo.
