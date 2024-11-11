import React, { useState } from "react";
import AddWantedItem from "./_components/AddWantedItem";
import WantedItemList from "./_components/WantedItemList";
import WrapSessionProvider from "../_components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";

const Page = async () => {
  return (
    <div className="mb-20 mt-[64px] min-h-[calc(100vh-64px)] pb-10 pt-8">
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
