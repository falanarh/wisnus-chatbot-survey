import { motion } from "framer-motion";

interface AuthTabProps {
  active: boolean;
  onClick: () => void;
  label: string;
  isDarkMode: boolean;
}

const AuthTab: React.FC<AuthTabProps> = ({ active, onClick, label, isDarkMode }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3.5 text-center relative transition-all duration-300 
        ${active 
          ? isDarkMode 
            ? 'bg-gray-700 text-white' 
            : 'bg-white/90 text-blue-700' 
          : isDarkMode 
            ? 'bg-gray-800/50 text-gray-400 hover:text-gray-300' 
            : 'bg-blue-100/30 text-gray-500 hover:text-gray-700'
        }
      `}
    >
      <span className="relative z-10 text-sm font-medium">{label}</span>
      
      {/* Active indicator */}
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className={`absolute bottom-0 inset-x-0 h-1 ${
            isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
};

export default AuthTab;