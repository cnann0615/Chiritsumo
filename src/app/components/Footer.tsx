import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-[4%] py-6 text-white">
      <div className="container mx-auto text-center">
        {/* コピーライト */}
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ちりつも. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
