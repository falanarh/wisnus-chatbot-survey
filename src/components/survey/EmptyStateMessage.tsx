import { Bot } from "lucide-react";

interface EmptyStateMessageProps {
  isDarkMode: boolean;
  mode: 'survey' | 'qa';
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ isDarkMode, mode }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 px-3 mb-[180px] z-10">
      <div className={`${isDarkMode
          ? 'bg-blue-900/30'
          : 'bg-blue-50/50'} 
          p-3 rounded-full backdrop-blur-sm border ${isDarkMode ? 'border-blue-800/30' : 'border-blue-100/30'}`}>
        <Bot className={`w-8 h-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
      </div>
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {mode === 'survey'
          ? 'Selamat datang di Survei Digital Wisnus'
          : 'Selamat datang di Layanan Tanya Jawab Survei Wisnus'}
      </p>
      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Silakan kirim pesan yang menyatakan bahwa Anda siap untuk memulai survei
      </p>
    </div>
  );
};

export default EmptyStateMessage;