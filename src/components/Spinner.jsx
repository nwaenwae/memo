import React from "react";
import { Hourglass } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Hourglass
        colors={["#8667A1", "#AE88D1"]}
        height={80}
        width={80}
        className="m-5"
      />
      <p className="text-sm text-center px-2 pt-2 text-[#8667A1]">{message}</p>
    </div>
  );
};

export default Spinner;
