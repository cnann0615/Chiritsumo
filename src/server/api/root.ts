import { Router } from "next/router";
import { tsumoBalanceRouter } from "~/server/api/routers/tsumoBalance";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tsumoLogRouter } from "./routers/tsumoLog";
import { habitualWasteRouter } from "./routers/habitualWaste";

// routerを１つにまとめるroot router//////////////////////////////////////////////

// /api/routersディレクトリに定義された個別のルーター（この場合はpostRouter）をまとめる
export const appRouter = createTRPCRouter({
  tsumoBalance: tsumoBalanceRouter,
  tsumoLog: tsumoLogRouter,
  habitualWaste: habitualWasteRouter,
});

// APIの型定義をエクスポート：クライアント側での型安全性を確保
export type AppRouter = typeof appRouter;

// サーバーサイドでAPIを直接呼び出すため関数
export const createCaller = createCallerFactory(appRouter);
