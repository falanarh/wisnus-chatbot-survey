import { motion } from "framer-motion";
import { JSX } from "react";

interface AuthTabProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: JSX.Element;
  isDarkMode: boolean;
}

const ModernAuthTab: React.FC<AuthTabProps> = ({ 
  active, 
  onClick, 
  label, 
  icon,
  isDarkMode 
}) => {
  return (
    <div className="relative w-full">
      <button
        onClick={onClick}
        className={`
          relative z-10 flex items-center justify-center gap-2.5 w-full py-4 text-center
          overflow-hidden group transition-all duration-300
          ${active 
            ? isDarkMode 
              ? "text-white" 
              : "text-blue-600" 
            : isDarkMode 
              ? "text-gray-400 hover:text-gray-300" 
              : "text-gray-500 hover:text-gray-700"
          }
        `}
      >
        {/* Icon with animated background */}
        <div className={`
          flex items-center justify-center
          relative transition-all duration-500
          ${active
            ? "scale-110"
            : "scale-100 group-hover:scale-105"
          }
        `}>
          <motion.div 
            className={`
              absolute inset-0 rounded-full
              ${active
                ? isDarkMode
                  ? "bg-blue-500/20"
                  : "bg-blue-100"
                : "bg-transparent group-hover:bg-gray-100 dark:group-hover:bg-gray-800/50"
              }
              transition-all duration-300
            `}
            layoutId={`bg-${label}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: active ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className={`
            relative w-5 h-5 transition-transform duration-300
            ${active ? "text-blue-600 dark:text-blue-400" : ""}
          `}>
            {icon}
          </div>
        </div>

        {/* Label text */}
        <span className={`
          relative text-sm font-medium transition-all duration-300
          ${active ? "font-semibold" : ""}
        `}>
          {label}
        </span>
      </button>

      {/* Active indicator pill that slides */}
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className={`
            absolute bottom-0 left-0 right-0 mx-auto w-16 h-1 rounded-t-full
            ${isDarkMode ? "bg-blue-500" : "bg-blue-600"}
            shadow-lg ${isDarkMode ? "shadow-blue-500/20" : "shadow-blue-500/30"}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Glowing effect for active tab */}
      {active && (
        <motion.div
          layoutId="tabGlow"
          className={`
            absolute bottom-0 left-1/2 -translate-x-1/2
            w-24 h-1 rounded-full blur-md
            ${isDarkMode ? "bg-blue-400/50" : "bg-blue-500/30"}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      )}
    </div>
  );
};

export default ModernAuthTab;