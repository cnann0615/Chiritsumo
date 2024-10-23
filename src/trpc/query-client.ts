import {
  defaultShouldDehydrateQuery,
  Query,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

// TanStack Queryのクライアント設定を行う///////////////////////////////

// QueryClientを作成する関数
// QueryClientのインスタンス生成を通じて、ServerComponentsでフェッチしたデータをClientComponentsへ渡すためのcreateQueryClient関数の定義を行っている。
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // データを再フェッチするまでの時間を設定
        // 同じデータに対する新たなクエリは、キャッシュされたデータを使用し、再フェッチは行いません。
        staleTime: 30 * 1000,
      },
      // サーバーからクライアントへのデータ転送（デハイドレーション）の設定
      dehydrate: {
        // ServerComponentsで取得したデータをシリアライズし、ClientComponentsに転送できる形式に変換
        serializeData: SuperJSON.serialize,
        // pending状態のクエリも含めることで、ServerComponentsで開始されたが完了していないクエリデータも転送可能になる。
        // これにより、ClientComponents側でクエリが進行中であることを示すローディング状態や部分的に取得したデータ表示が可能になる。
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      // クライアントでのデータ復元（ハイドレーション）の設定
      // ServerComponentsで取得したデータをClientComponentsで再構築し、使用可能な状態にする際の設定。
      // SuperJSONのdeserializeメソッドを使用して、シリアライズされたデータを元の複雑なデータ構造（Date、Map、Setなど）に復元する。
      // これにより、サーバーサイドのデータをクライアントサイドで正確に再現できる。
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
