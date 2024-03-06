import { Suspense } from "react";
import type { NextPage } from "next";
import { App } from "~~/components/App";

const Home: NextPage = () => {
  return (
    <Suspense>
      <App />
    </Suspense>
  );
};

export default Home;
