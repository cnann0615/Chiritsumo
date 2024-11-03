import WrapSessionProvider from "../components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";
import AddBalance from "./AddBalance";
import BalanceDisplay from "./BalanceDisplay";
import { getServerAuthSession } from "~/server/auth";
import BalanceProgress from "./BalanceProgress";
import { db } from "~/server/db";

// サインイン時の親コンポーネント
const Main = async () => {
  // サインインしたユーザのbalanceテーブルのレコードを作成
  try {
    const session = await getServerAuthSession();
    const existingRecord = await db.balance.findUnique({
      where: { userId: session!.user.id },
    });
    if (!existingRecord) {
      await db.balance.create({
        data: {
          userId: session!.user.id,
          balance: 0,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="mb-20 mt-[64px] min-h-[calc(100vh-64px)]">
      <HydrateClient>
        <WrapSessionProvider>
          <BalanceDisplay />
          <AddBalance />
          <BalanceProgress />
        </WrapSessionProvider>
      </HydrateClient>
    </div>
  );
};

export default Main;
