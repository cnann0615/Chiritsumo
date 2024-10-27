import React from "react";
import AddHabitualWaste from "./AddHabitualWaste";
import HabitualWastedList from "./HabitualWastedList";

const HabitualWasteManagement = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-100">無駄リスト</h2>
      <AddHabitualWaste />
      <HabitualWastedList />
    </div>
  );
};

export default HabitualWasteManagement;
