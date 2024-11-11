import React from "react";

const CopyRight = () => {
  return (
    <div className="container mx-auto hidden text-center sm:block">
      <div className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ちりつも. All Rights Reserved.
      </div>
    </div>
  );
};

export default CopyRight;
