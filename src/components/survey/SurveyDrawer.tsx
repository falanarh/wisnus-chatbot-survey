import React from "react";

interface SurveyDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SurveyDrawer: React.FC<SurveyDrawerProps> = ({ open, onClose, title, children }) => {
  return (
    <>
      {/* Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[520px] max-w-full z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">{title}</h2>
          <button
            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            onClick={onClose}
            aria-label="Tutup drawer"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  );
};

export default SurveyDrawer; 