import WrapSessionProvider from "../components/WrapSessionProvider";
import { api, HydrateClient } from "~/trpc/server";
import AddTsumo from "./AddTsumo";
import TsumoBalanceDisplay from "./TsumoBalanceDisplay";
import { getServerAuthSession } from "~/server/auth";
import WantedItemList from "../wantedItemManagement/components/WantedItemList";
import TsumoBalanceProgress from "./TsumoBalanceProgress";

const Main = async () => {
  const session = await getServerAuthSession();

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
