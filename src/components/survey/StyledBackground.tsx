import React from "react";

const StyledBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen relative">
    {/* Fixed Background Layer - same as homepage */}
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                          linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Subtle Dots Pattern */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Colored Blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
    </div>

    {/* Content on top of background */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export default StyledBackground; 