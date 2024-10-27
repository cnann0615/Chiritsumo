import { getServerAuthSession } from "~/server/auth";
import SignOut from "./main/SignOut";
import Main from "./main/Main";

export default async function Home() {
  const session = await getServerAuthSession();
  return <main>{session ? <Main /> : <SignOut />}</main>;
}
