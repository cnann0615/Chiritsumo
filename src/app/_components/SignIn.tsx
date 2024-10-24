import React from "react";
import Main from "./Main";
import { getServerAuthSession } from "~/server/auth";

const SignIn = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <Main />
    </div>
  );
};

export default SignIn;
