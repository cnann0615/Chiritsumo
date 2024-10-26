import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { TbMountain } from "react-icons/tb";

const SignOut = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center">
      <TbMountain size={250} data-testid="icon" />
      <h1 className="mb-5 text-6xl font-bold">ちりつも</h1>
      <Link
        href={"/api/auth/signin"}
        className="flex w-[20%] items-center justify-center gap-3 rounded-full bg-white/10 px-10 py-3 text-2xl font-semibold no-underline transition hover:bg-white/20"
      >
        <FcGoogle className="inline size-4 md:size-8" />
        <p className="inline">Sign in for Google！</p>
      </Link>
    </div>
  );
};

export default SignOut;
