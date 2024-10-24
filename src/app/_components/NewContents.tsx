"use client";
import { useSession } from "next-auth/react";
import React from "react";

const NewContents = () => {
  const { data: session, status } = useSession();
  console.log(session);
  console.log(status);
  return <div>{`クライアントでセッション取得：${session?.user.name}`}</div>;
};

export default NewContents;
