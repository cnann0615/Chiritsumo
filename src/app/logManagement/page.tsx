import React from "react";
import { getServerAuthSession } from "~/server/auth";
import SignOut from "../main/SignOut";
import LogList from "./_components/LogList";
import WrapSessionProvider from "../_components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";
import Title from "./_components/Title";

const page = async () => {
  // セッション情報取得
  const session = await getServerAuthSession();
  return (
    <main>
      {session ? (
        <div className="mb-20 mt-[64px] min-h-[calc(100vh-64px)] pb-10 pt-8">
          <HydrateClient>
            <WrapSessionProvider>
              <div>
                <Title />
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
