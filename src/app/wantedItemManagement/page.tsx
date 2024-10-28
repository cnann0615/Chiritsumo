import React, { useState } from "react";
import AddWantedItem from "./components/AddWantedItem";
import WantedItemList from "./components/WantedItemList";
import WrapSessionProvider from "../components/WrapSessionProvider";
import { HydrateClient } from "~/trpc/server";
import { get } from "http";
import { getOgp } from "../lib/getOgp";

const Page = async () => {
  return (
    <div className="min-h-[calc(100vh-64px)] py-4">
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
