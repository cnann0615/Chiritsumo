import React from "react";
import { getServerAuthSession } from "~/server/auth";
import SignOut from "../main/SignOut";
import LogList from "./components/LogList";
import WrapSessionProvider from "../components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";

const page = async () => {
  // セッション情報取得
  const session = await getServerAuthSession();
  return (
    <main>
      {session ? (
        <div className="mb-20 mt-[64px] min-h-[calc(100vh-64px)] pb-10 pt-8">
          <HydrateClient>
            <WrapSessionProvider>
              <div className="space-y-10">
                <LogList />
              </div>
            </WrapSessionProvider>
          </HydrateClient>
        </div>
      ) : (
        <SignOut />
      )}
    </main>
  );
};

export default page;
