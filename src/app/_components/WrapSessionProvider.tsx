"use client";
import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type WrapSessionProvider = {
  children: ReactNode;
};

const WrapSessionProvider = ({ children }: WrapSessionProvider) => {
  return (
    <div>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
};

export default WrapSessionProvider;
