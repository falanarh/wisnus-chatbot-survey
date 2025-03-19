import React from 'react';

const Loader: React.FC = () => {
  return (
    <div
      className="w-10 h-10 border-4 border-t-blue-600 dark:border-t-blue-300 border-gray-200 dark:border-gray-800 rounded-full animate-spin"
    ></div>
  );
};

export default Loader;