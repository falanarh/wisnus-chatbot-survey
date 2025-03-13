import { motion } from "framer-motion";

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  label: string;
  isDarkMode: boolean;
  onClick?: () => void;
}

const ModernSocialLoginButton: React.FC<SocialLoginButtonProps> = ({ 
  provider, 
  label, 
  isDarkMode,
  onClick 
}) => {
  const getProviderColor = () => {
    switch (provider) {
      case 'google':
        return {
          bg: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-50',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
          text: isDarkMode ? 'text-white' : 'text-gray-800'
        };
      case 'facebook':
        return {
          bg: isDarkMode ? 'hover:bg-[#1877F2]/10' : 'hover:bg-[#1877F2]/5',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
          text: isDarkMode ? 'text-white' : 'text-gray-800'
        };
      case 'apple':
        return {
          bg: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
          text: isDarkMode ? 'text-white' : 'text-gray-800'
        };
      default:
        return {
          bg: isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-50',
          border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
          text: isDarkMode ? 'text-white' : 'text-gray-800'
        };
    }
  };

  const renderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <div className="h-5 w-5 relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18v2.84c0-.98.82-1.75 1.84-1.75.25 0 .5.05.72.14l2.81 2.81.29 1.98z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07h3.66C6.69 6.08 8.77 5.38 12 5.38z" fill="#EA4335" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className="h-5 w-5 relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'apple':
        return (
          <div className="h-5 w-5 relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isDarkMode ? "#FFFFFF" : "#000000"} className="w-5 h-5">
              <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-3 1.35 4.32 4.32 0 0 0-1.1 2.65 3.84 3.84 0 0 0 3.04-1.31zM17.37 12c0-2 1.5-3 1.5-3a3.87 3.87 0 0 0-3-1.5A4.58 4.58 0 0 0 13 9c-.57 0-1.15-.27-1.8-.27-.68 0-2.17.27-3.25 2.16-1.35 2.24-.35 5.63.94 7.47.67.94 1.46 2 2.47 2 .98 0 1.37-.63 2.53-.63 1.15 0 1.5.63 2.5.63 1.02 0 1.8-1.06 2.45-2a8.5 8.5 0 0 0 1.14-2.26c-2.3-1.08-2.6-5.06.39-6.1z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Colors based on the provider and theme
  const colors = getProviderColor();

  return (
    <motion.button
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      type="button"
      onClick={onClick}
      className={`
        w-full py-3 px-4 flex justify-center items-center gap-3 rounded-xl font-medium 
        ${isDarkMode
          ? 'bg-gray-800/70 hover:bg-gray-700/70'
          : 'bg-white hover:bg-gray-50'
        } 
        border ${colors.border} 
        ${colors.text}
        shadow-sm hover:shadow 
        transition-all duration-200
      `}
    >
      {renderIcon()}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
};

export default ModernSocialLoginButton;