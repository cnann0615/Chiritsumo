import { getServerAuthSession } from "~/server/auth";
import SignOut from "./main/SignOut";
import Main from "./main/Main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main>
      <ReactQueryDevtools />
      {session ? <Main /> : <SignOut />}
    </main>
  );
}
