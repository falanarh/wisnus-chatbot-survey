import React from "react";
import StyledBackground from "./StyledBackground";

interface ErrorStateProps {
  error: string;
  refreshStatus: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, refreshStatus }) => (
  <StyledBackground>
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-6 rounded-lg max-w-md shadow-lg">
        <h2 className="font-bold text-lg mb-2">Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button
          onClick={refreshStatus}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </StyledBackground>
);

export default ErrorState; 