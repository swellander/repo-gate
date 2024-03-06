"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { requestRepoInvite, requestToken, requestUser } from "../utils/scaffold-eth/probot";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";
import { useAutoConnect } from "~~/hooks/scaffold-eth";

const staticUser = {
  login: "swellander",
  id: 22231097,
  node_id: "MDQ6VXNlcjIyMjMxMDk3",
  avatar_url: "https://avatars.githubusercontent.com/u/22231097?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/swellander",
  html_url: "https://github.com/swellander",
  followers_url: "https://api.github.com/users/swellander/followers",
  following_url: "https://api.github.com/users/swellander/following{/other_user}",
  gists_url: "https://api.github.com/users/swellander/gists{/gist_id}",
  starred_url: "https://api.github.com/users/swellander/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/swellander/subscriptions",
  organizations_url: "https://api.github.com/users/swellander/orgs",
  repos_url: "https://api.github.com/users/swellander/repos",
  events_url: "https://api.github.com/users/swellander/events{/privacy}",
  received_events_url: "https://api.github.com/users/swellander/received_events",
  type: "User",
  site_admin: false,
  name: "Sam Wellander",
  company: "Simple Fractal",
  blog: "",
  location: "Seattle",
  email: "samwellander@gmail.com",
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 131,
  public_gists: 4,
  followers: 27,
  following: 61,
  created_at: "2016-09-16T04:46:47Z",
  updated_at: "2024-03-04T19:09:31Z",
};

interface Props {
  installationId: string;
  repoName: string;
  repoOwner: string;
}

const GetSignature = ({ installationId, repoName, repoOwner }: Props) => {
  useAutoConnect();
  const [errorMsg, setErrorMsg] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  const [ghUserData, setGHUserData] = useState<any>();
  const [accessToken, setAccessToken] = useState("");
  const { openConnectModal } = useConnectModal();
  const { signMessage, data: signature, isLoading: waitingForSignature, isError: rejectedSignature } = useSignMessage();

  const sign = () => {
    signMessage({ message: "I would like to receive a repo invite from repo-gate." });
  };

  useEffect(() => {
    const sendRepoInvite = async () => {
      if (signature) {
        setSendingInvite(true);
        const res = await requestRepoInvite({
          githubAccessToken: accessToken,
          installationId,
          signature,
          repoName,
          repoOwner,
        });
        setSendingInvite(false);
        if (res.status === 201) {
          window.location.assign(`https://github.com/settings/organizations`);
        } else if (res.status === 404) setErrorMsg("Account does not own token. Try a different account?");
        else {
          setErrorMsg("Something went wrong.");
        }
        setTimeout(() => setErrorMsg(""), 5000);
      }
    };
    if (signature && accessToken) {
      sendRepoInvite();
    }
  }, [signature, accessToken, installationId, repoName, repoOwner]);

  const getRedirectUri = useCallback(() => {
    const params = new URLSearchParams();
    params.append("repo", repoName);
    params.append("owner", repoOwner);
    params.append("installation_id", installationId);

    return `${window.location.origin}?${params.toString()}`;
  }, [repoName, repoOwner, installationId]);

  const redirectToGithubLogin = useCallback(() => {
    const redirecUri = getRedirectUri();
    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID || "");
    params.append("redirect_uri", redirecUri);
    window.location.assign(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }, [getRedirectUri]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    const getToken = async () => {
      const accessToken = await requestToken(code || "");
      if (accessToken) setAccessToken(accessToken);
    };
    if (code) getToken();
    else redirectToGithubLogin();
  }, [redirectToGithubLogin]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await requestUser(accessToken);
      setGHUserData(userData);
    };
    if (accessToken) getUser();
  }, [accessToken]);

  useEffect(() => {
    if (ghUserData) openConnectModal?.();
  }, [openConnectModal, ghUserData]);

  return (
    <div
      className="GetSignature"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="flex flex-col items-center">
        {ghUserData && (
          <>
            <Image
              src={ghUserData.avatar_url}
              width={245}
              height={245}
              alt={ghUserData.login}
              className="rounded-full mb-5"
            />
            <h1>{ghUserData?.login}</h1>
            <button className="btn btn-accent" onClick={sign}>
              {waitingForSignature ? (
                <span className="flex items-center">
                  Waiting for signature
                  <span className="loading loading-spinner ml-2" />
                </span>
              ) : rejectedSignature ? (
                <span>Rejected signature. Try again?</span>
              ) : sendingInvite ? (
                <span className="flex items-center">
                  Sending invite
                  <span className="loading loading-spinner ml-2" />
                </span>
              ) : (
                <span>Get invite to {repoName} repo</span>
              )}
            </button>
            {errorMsg && (
              <div role="alert" className="alert alert-warning absolute right-4 bottom-4 w-1/3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GetSignature;
