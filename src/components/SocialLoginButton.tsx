interface SocialLoginButtonProps {
    provider: 'google' | 'facebook';
    label: string;
    isDarkMode: boolean;
    onClick?: () => void;
  }
  
  const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ 
    provider, 
    label, 
    isDarkMode,
    onClick 
  }) => {
    const renderIcon = () => {
      switch (provider) {
        case 'google':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 186.69 190.5">
              <g transform="translate(1184.583 765.171)">
                <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" fill="#ea4335"/>
              </g>
            </svg>
          );
        case 'facebook':
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          );
        default:
          return null;
      }
    };
  
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full py-2.5 px-4 flex justify-center items-center gap-2 rounded-lg font-medium 
          ${isDarkMode
            ? 'bg-white text-gray-800 hover:bg-gray-100'
            : 'bg-white text-gray-800 hover:bg-gray-50'
          } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm transition-colors`}
      >
        {renderIcon()}
        <span>{label}</span>
      </button>
    );
  };
  
  export default SocialLoginButton;