"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { requestRepoInvite, requestToken, requestUser } from "../utils/scaffold-eth/probot";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";
import { useAutoConnect } from "~~/hooks/scaffold-eth";

interface Props {
  installationId: string;
  repoName: string;
  repoOwner: string;
}

const GetSignature = ({ installationId, repoName, repoOwner }: Props) => {
  useAutoConnect();
  const [errorMsg, setErrorMsg] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

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
          setInviteSuccess(true);
          window.location.assign(`https://github.com/${repoOwner}/${repoName}/invitations`);
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
        {ghUserData ? (
          <>
            <Image
              src={ghUserData.avatar_url}
              width={245}
              height={245}
              alt={ghUserData.login}
              className="rounded-full mb-5"
            />
            <h1>{ghUserData?.login}</h1>
            <button className="btn btn-primary" onClick={sign} disabled={inviteSuccess || waitingForSignature}>
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
              ) : inviteSuccess ? (
                <span>Invite sent!</span>
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
        ) : (
          <span className="loading loading-spinner loading-lg" />
        )}
      </div>
    </div>
  );
};

export default GetSignature;
