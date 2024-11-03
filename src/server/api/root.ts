import { Router } from "next/router";
import { balanceRouter } from "./routers/balance";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { logRouter } from "./routers/log";
import { wantedItemRouter } from "./routers/wantedItem";

// routerを１つにまとめるroot router//////////////////////////////////////////////

// /api/routersディレクトリに定義された個別のルーターをまとめる
export const appRouter = createTRPCRouter({
  balance: balanceRouter,
  log: logRouter,
  wantedItem: wantedItemRouter,
});

// APIの型定義をエクスポート：クライアント側での型安全性を確保
export type AppRouter = typeof appRouter;

// サーバーサイドでAPIを直接呼び出すため関数
export const createCaller = createCallerFactory(appRouter);
