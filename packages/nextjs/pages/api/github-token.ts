import type { NextApiRequest, NextApiResponse } from "next";

const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ghResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code,
      }),
    });

    if (!ghResponse.ok) res.status(ghResponse.status).send("Error exchanging tokens");
    else {
      const ghData = await ghResponse.json();
      res.status(200).json(ghData);
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Error exchanging tokens");
  }
}
