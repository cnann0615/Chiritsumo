import WrapSessionProvider from "../components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";
import AddTsumo from "./AddTsumo";
import TsumoBalanceDisplay from "./TsumoBalanceDisplay";
import { getServerAuthSession } from "~/server/auth";
import TsumoBalanceProgress from "./TsumoBalanceProgress";
import { db } from "~/server/db";

const Main = async () => {
  try {
    const session = await getServerAuthSession();

    const existingRecord = await db.tsumoBalance.findUnique({
      where: { userId: session!.user.id },
    });
    if (!existingRecord) {
      await db.tsumoBalance.create({
        data: {
          userId: session!.user.id,
          tsumoBalance: 0,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <HydrateClient>
        <WrapSessionProvider>
          <TsumoBalanceDisplay />
          <AddTsumo />
          <TsumoBalanceProgress />
        </WrapSessionProvider>
      </HydrateClient>
    </div>
  );
};

export default Main;
