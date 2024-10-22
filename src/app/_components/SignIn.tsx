import Link from "next/link";
import React from "react";

import { getServerAuthSession } from "~/server/auth";
import Main from "./main";
const session = await getServerAuthSession();

const SignIn = () => {
  return (
    <div>
      <Main />
      <Link
        href={"/api/auth/signout"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        "Sign out"
      </Link>
      {session?.user && <main />}
    </div>
  );
};

export default SignIn;
