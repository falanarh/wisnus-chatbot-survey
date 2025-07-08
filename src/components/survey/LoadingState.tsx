import React from "react";
import StyledBackground from "./StyledBackground";
import Loader from "../other/Loader";

const LoadingState: React.FC = () => (
  <StyledBackground>
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Memuat data survei...</p>
      </div>
    </div>
  </StyledBackground>
);

export default LoadingState; 