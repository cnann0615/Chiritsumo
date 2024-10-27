import WrapSessionProvider from "../components/WrapSessionProvider";
import { api, HydrateClient } from "~/trpc/server";
import AddTsumo from "./AddTsumo";
import TsumoBalanceDisplay from "./TsumoBalanceDisplay";
import { getServerAuthSession } from "~/server/auth";

const Main = async () => {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <HydrateClient>
        <WrapSessionProvider>
          <TsumoBalanceDisplay />
          <AddTsumo />
        </WrapSessionProvider>
      </HydrateClient>
    </div>
  );
};

export default Main;
