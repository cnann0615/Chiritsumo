import React from "react";
import AddHabitualWaste from "./AddHabitualWaste";
import HabitualWastedList from "./HabitualWastedList";

const HabitualWasteManagement = () => {
  return (
    <div className="space-y-4">
      <AddHabitualWaste />
      <HabitualWastedList />
    </div>
  );
};

export default HabitualWasteManagement;
