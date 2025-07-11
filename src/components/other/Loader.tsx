import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Memuat...
        </div>
      </div>
    </div>
  );
};

export default Loader;