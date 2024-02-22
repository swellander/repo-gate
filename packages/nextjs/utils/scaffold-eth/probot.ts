export const requestToken = async (code: string) => {
  const tokenUrl = `http://${process.env.NEXT_PUBLIC_PROXY_SERVER_HOST}/token-gate/token?code=${code}`;
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
  const inviteUrl = `http://${process.env.NEXT_PUBLIC_PROXY_SERVER_HOST}/token-gate/invite`;
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
