"use client";

import React from 'react';
import { useTheme } from './ThemeContext';
import Header from './Header';

export default function ClientBody({ 
  children, 
  fontClass 
}: { 
  children: React.ReactNode; 
  fontClass: string;
}) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen transition-colors duration-300`}>
      <Header fontClass={fontClass} />
      {children}
    </div>
  );
}