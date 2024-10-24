import { getServerAuthSession } from "~/server/auth";
import SignIn from "./_components/SignIn";
import SignOut from "./_components/SignOut";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {session ? <SignIn /> : <SignOut />}
    </main>
  );
}
