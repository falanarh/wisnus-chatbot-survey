import Image from "next/image";
import { Menu } from "lucide-react";
import { Merriweather_Sans } from "next/font/google";
import ThemeToggle from "../other/ThemeToggle";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ChatHeaderProps {
  isDarkMode: boolean;
  mode: 'survey' | 'qa';
  onSidebarToggle: () => void;
  themeMenuOpen: boolean;
  setThemeMenuOpen: (open: boolean) => void;
  closeOtherDropdowns: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isDarkMode,
  mode,
  onSidebarToggle,
  themeMenuOpen,
  setThemeMenuOpen,
  closeOtherDropdowns
}) => {
  return (
    <div className={`sticky top-0 z-30 w-full ${isDarkMode
      ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80'
      : 'bg-gradient-to-r from-blue-400/80 to-indigo-400/80'} 
      backdrop-blur-md text-white p-4 shadow-md`}>
      <div className="max-w-6xl mx-auto flex items-start justify-between">
        <div className="flex items-center gap-2 w-full sm:w-[400px]">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <div onClick={() => window.location.href = '/'} className="flex items-center gap-2 cursor-pointer">
            <Image
              src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
              alt="Badan Pusat Statistik"
              width={isDarkMode ? 42 : 48}
              height={isDarkMode ? 42 : 48}
            />
            <h1 className={`hidden md:block text-[12px] md:text-lg ${merriweatherSans.className} font-bold text-white`}>
              Badan Pusat Statistik
            </h1>
            <h2 className="block sm:hidden text-[14px] font-bold">
              {mode === 'survey' ? 'Survei Digital Wisatawan Nusantara' : 'Tanya Jawab Survei Wisnus'}
            </h2>
          </div>
        </div>

        {/* Chat Type Title */}
        <div className="hidden sm:block w-[400px] mx-auto px-2">
          <h2 className="hidden sm:block text-[12px] sm:text-[18px] md:text-xl font-bold text-center">
            {mode === 'survey' ? 'Survei Digital Wisatawan Nusantara' : 'Tanya Jawab Survei Wisnus'}
          </h2>
          <p className={`hidden md:block text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-100'} text-center`}>
            {mode === 'survey' ? 'Berbagi pengalaman perjalanan Anda' : 'Informasi statistik BPS'}
          </p>
        </div>

        <div className="sm:w-[400px] flex items-center justify-end gap-2">
          {/* Theme Toggle */}
          <ThemeToggle
            isOpen={themeMenuOpen}
            setIsOpen={setThemeMenuOpen}
            closeOtherDropdowns={closeOtherDropdowns}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;