import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

// tRPCとTanstack Queryを統合して、サーバーサイドでのデータフェッチとクライアントサイドでのハイドレーションを行うための設定///////////////////////////////

// サーバーサイドのtRPCコンテキストを作成し、キャッシュする
const createContext = cache(() => {
  const heads = new Headers(headers());
  // `x-trpc-source`ヘッダーを設定して、リクエストがRSCから来ていることを明示
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

// Tanstack Queryのクエリクライアントを生成し、キャッシュする
const getQueryClient = cache(createQueryClient);

// tRPCの呼び出し関数を作成
const caller = createCaller(createContext);

// tRPCとTanstack Queryを統合するヘルパー関数
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
