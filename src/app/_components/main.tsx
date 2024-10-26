import WrapSessionProvider from "./WrapSessionProvider";
import NewContents from "./NewContents";
import { api } from "~/trpc/server";
import AddTsumo from "./AddTsumo";
import TsumoBalanceDisplay from "./TsumoBalanceDisplay";

const Main = async () => {
  return (
    <>
      <WrapSessionProvider>
        <TsumoBalanceDisplay />
        <AddTsumo />
        <NewContents />
      </WrapSessionProvider>
    </>
  );
};

export default Main;
