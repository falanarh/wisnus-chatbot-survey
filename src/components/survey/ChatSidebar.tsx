import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { X, LogOut, Trash2, User, Home } from "lucide-react";
import Link from "next/link";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onClearChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onClearChat
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed top-0 left-0 h-full w-[280px] z-50 
          ${isDarkMode 
            ? 'bg-gray-900 border-r border-gray-800' 
            : 'bg-white border-r border-gray-200'} 
          shadow-xl overflow-y-auto`}
      >
        {/* Sidebar header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode 
              ? 'text-gray-400 hover:bg-gray-800' 
              : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* User profile */}
        <div className="p-4">
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${isDarkMode 
            ? 'bg-gray-800/70' 
            : 'bg-gray-50'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode 
              ? 'bg-blue-900/70 text-blue-300' 
              : 'bg-blue-100 text-blue-600'}`}
            >
              <User size={20} />
            </div>
            <div>
              <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || 'Pengguna'}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email || 'pengguna@email.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="p-4 space-y-2">
          <Link href="/" className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode 
            ? 'text-gray-300 hover:bg-gray-800' 
            : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Home size={18} />
            <span>Halaman Utama</span>
          </Link>
          
          <button
            onClick={onClearChat}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${isDarkMode 
              ? 'text-red-400 hover:bg-red-900/20' 
              : 'text-red-600 hover:bg-red-50'}`}
          >
            <Trash2 size={18} />
            <span>Hapus Percakapan</span>
          </button>
        </div>

        {/* Bottom actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;