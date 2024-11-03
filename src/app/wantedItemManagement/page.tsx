import React, { useState } from "react";
import AddWantedItem from "./components/AddWantedItem";
import WantedItemList from "./components/WantedItemList";
import WrapSessionProvider from "../components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";

const Page = async () => {
  return (
    <div className="mb-20 mt-[64px] min-h-[calc(100vh-64px)] pb-10 pt-4">
      <HydrateClient>
        <WrapSessionProvider>
          <AddWantedItem />
          <WantedItemList />
        </WrapSessionProvider>
      </HydrateClient>
    </div>
  );
};

export default Page;
