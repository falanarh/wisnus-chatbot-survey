import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;