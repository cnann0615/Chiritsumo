import { getServerAuthSession } from "~/server/auth";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Main from "./_main/Main";
import SignOut from "./_main/SignOut";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main>
      {/* TanstackQuery開発者ツール */}
      <ReactQueryDevtools />
      {session ? <Main /> : <SignOut />}
    </main>
  );
}
