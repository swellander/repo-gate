"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { requestRepoInvite, requestToken, requestUser } from "../utils/scaffold-eth/probot";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";

interface Props {
  installationId: string;
  repoName: string;
  repoOwner: string;
}

const GetSignature = ({ installationId, repoName, repoOwner }: Props) => {
  const [errorMsg, setErrorMsg] = useState("");

  const [ghUserData, setGHUserData] = useState<any>();
  const [accessToken, setAccessToken] = useState("");
  const { openConnectModal } = useConnectModal();
  const { signMessage, data: signature } = useSignMessage();
  const sign = () => {
    signMessage({ message: "I would like to receive a repo invite from repo-gate." });
  };

  useEffect(() => {
    const sendRepoInvite = async () => {
      if (signature) {
        const res = await requestRepoInvite({
          githubAccessToken: accessToken,
          installationId,
          signature,
          repoName,
          repoOwner,
        });
        console.log({ res });
        if (res.status === 201) {
          window.location.assign(`https://github.com/settings/organizations`);
        } else if (res.status === 404) setErrorMsg("Account does not own token. Try a different account?");
        else {
          setErrorMsg("Something went wrong.");
        }
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
    openConnectModal?.();
  }, [openConnectModal]);

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
        {errorMsg && <h1>{errorMsg}</h1>}
        {ghUserData && (
          <>
            <Image
              src={ghUserData.avatar_url}
              width={45}
              height={45}
              alt={ghUserData.login}
              className="rounded-full mb-5"
            />
            <h1>{ghUserData?.login}</h1>
            <button className="btn" onClick={sign}>
              Prove Ownership of SPORK token
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GetSignature;
