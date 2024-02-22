"use client";

import { useSearchParams } from "next/navigation";
import type { NextPage } from "next";
import GetSignature from "~~/components/GetSignature";

const Home: NextPage = () => {
  const searchParams = useSearchParams();
  const installationId = searchParams.get("installation_id");
  const repoName = searchParams.get("repo");
  const repoOwner = searchParams.get("owner");

  if (!installationId || !repoName || !repoOwner) {
    return (
      <div
        className="Home"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>404</h1>
      </div>
    );
  } else {
    return <GetSignature installationId={installationId} repoName={repoName} repoOwner={repoOwner} />;
  }
};

export default Home;
