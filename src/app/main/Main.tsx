import WrapSessionProvider from "../components/WrapSessionProvider";
import { api, HydrateClient } from "~/trpc/server";
import AddTsumo from "./AddTsumo";
import TsumoBalanceDisplay from "./TsumoBalanceDisplay";
import { getServerAuthSession } from "~/server/auth";
import WantedItemList from "../wantedItemManagement/components/WantedItemList";
import TsumoBalanceProgress from "./TsumoBalanceProgress";
import { db } from "~/server/db";

const Main = async () => {
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
    console.log("New TsumoBalance record created successfully");
  } else {
    console.log("TsumoBalance record already exists for userId:");
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
