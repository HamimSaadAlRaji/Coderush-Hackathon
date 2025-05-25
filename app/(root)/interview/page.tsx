import Agent from "@/components/Agent";
import React from "react";
import { TbRobot } from "react-icons/tb";

const page = () => {
  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center ">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <TbRobot className="text-white text-xl" />
            </div>
            <h3 className="capitalize">AI Assistant Chat</h3>
          </div>
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-full h-fit capitalize">
          Voice Assistant
        </p>
      </div>
      <Agent />
    </>
  );
};

export default page;
