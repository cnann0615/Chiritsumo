import Link from "next/link";
import React from "react";

import { getServerAuthSession } from "~/server/auth";
const session = await getServerAuthSession();

const SignOut = () => {
  return (
    <div>
      <Link
        href={"/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        "Sign in"
      </Link>
    </div>
  );
};

export default SignOut;
