"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

// tRPCとTanStack Queryを統合し、Next.jsアプリケーション全体でのデータフェッチングと状態管理のための基盤を作成///////////////////////////////

let clientQueryClientSingleton: QueryClient | undefined = undefined;
// クエリクライアントを取得または作成する関数
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // サーバーサイド: 常に新しいクエリクライアントを作成
    return createQueryClient();
  }
  // ブラウザ: シングルトンパターンを使用して同じクエリクライアントを保持
  return (clientQueryClientSingleton ??= createQueryClient());
};

// tRPCクライアントの作成（AppRouter型を使用して型安全性を確保）
export const api = createTRPCReact<AppRouter>();

// ルーター入力の型推論ヘルパー
export type RouterInputs = inferRouterInputs<AppRouter>;

// ルーター出力の型推論ヘルパー
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// tRPCとTanstack Queryを統合するプロバイダーコンポーネント
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  // クエリクライアントの取得
  const queryClient = getQueryClient();

  // tRPCクライアントの作成
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // ログの設定（コンソールに操作ログを表示させるデバッグ機能）
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // HTTP経由でtRPCリクエストをバッチ処理し、ストリーミングするための設定
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  // QueryClientProviderとapi.Providerでラップしたコンポーネントを返す
  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

// ベースURLを取得する関数（環境に応じて適切なURLを返す）
function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
