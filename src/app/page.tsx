import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import SignIn from "./_components/SignIn";
import SignOut from "./_components/SignOut";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {session ? <SignIn /> : <SignOut />}
      </main>
    </HydrateClient>
  );
}
