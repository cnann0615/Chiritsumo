"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type WrapSessionProvider = {
  children: ReactNode;
};

const WrapSessionProvider = ({ children }: WrapSessionProvider) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default WrapSessionProvider;
