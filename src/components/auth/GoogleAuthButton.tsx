// src/components/auth/ModernGoogleAuthButton.tsx
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface ModernGoogleAuthButtonProps {
  label: string;
  isDarkMode: boolean;
  isSignIn?: boolean;
}

// Type definitions for Google Identity Services
interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId?: string;
}

interface GoogleNotificationObject {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
          }) => void;
          renderButton: (element: HTMLElement, config: {
            type?: string;
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
            width?: number;
            locale?: string;
          }) => void;
          prompt: (callback?: (notification: GoogleNotificationObject) => void) => void;
          revoke: (accessToken: string, callback: () => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {error?: string; access_token?: string}) => void;
            error_callback?: (error: {type: string; message: string}) => void;
          }) => {
            requestAccessToken: (overrideConfig?: object) => void;
          };
        };
      };
    };
  }
}

// Google client ID from environment variable
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const ModernGoogleAuthButton: React.FC<ModernGoogleAuthButtonProps> = ({ 
  label, 
  isDarkMode,
  isSignIn = true 
}) => {
  const { googleAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // The Google button might be rendered after the customButton is hidden
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Set up error handler for Google API related errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if this is the Google Identity Services error
      if (args[0] === 'Google Identity Services not available') {
        // Don't log to console, silently handle it
        if (!scriptLoadedRef.current) {
          // Try loading the script again after a delay
          setTimeout(() => {
            loadGoogleScript();
          }, 1000);
        }
        return;
      }
      
      // Pass through other error calls
      originalConsoleError.apply(console, args);
    };

    if (typeof window !== 'undefined') {
      if (window.google) {
        scriptLoadedRef.current = true;
        initializeGoogleButton();
      } else {
        loadGoogleScript();
      }
    }

    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
    };
  }, []);

  // Load the Google API script
  const loadGoogleScript = () => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not defined');
      setError('Google authentication is not configured properly');
      return;
    }

    // Check if script is already loaded or being loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      if (window.google) {
        scriptLoadedRef.current = true;
        initializeGoogleButton();
      }
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        // Add a small delay to ensure Google's JS is fully initialized
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            initializeGoogleButton();
          }
        }, 100);
      };
      
      script.onerror = () => {
        console.warn('Failed to load Google Identity Services script');
        setError('Failed to load Google authentication');
      };
      
      document.body.appendChild(script);
    } catch (err) {
      console.warn('Error loading Google script:', err);
    }
  };

  const initializeGoogleButton = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      // Don't show error, just silently fail
      return;
    }

    if (!googleButtonRef.current) return;

    try {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID!,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Create a hidden div for actual Google button
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
        
        // Render the Google Sign-In button in a hidden div
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: isDarkMode ? 'filled_black' : 'outline',
          size: 'large',
          text: isSignIn ? 'signin_with' : 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: containerRef.current?.clientWidth || 300,
          locale: 'id_ID', // Indonesian locale
        });
      }
    } catch (err) {
      console.warn('Error initializing Google button:', err);
    }
  };

  const handleGoogleCredentialResponse = async (response: GoogleCredentialResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Call our backend with the ID token
      await googleAuth(response.credential);
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsLoading(false);
    }
  };

  // Custom click handler that triggers the Google sign-in
  const handleCustomButtonClick = () => {
    if (googleButtonRef.current) {
      // Find and click the Google button within the ref
      const googleButton = googleButtonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        (googleButton as HTMLElement).click();
      } else {
        // If Google button is not available, try loading it again
        loadGoogleScript();
      }
    }
  };

  // Render Google icon
  const renderGoogleIcon = () => {
    return (
      <div className="h-5 w-5 relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18v2.84c0-.98.82-1.75 1.84-1.75.25 0 .5.05.72.14l2.81 2.81.29 1.98z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07h3.66C6.69 6.08 8.77 5.38 12 5.38z" fill="#EA4335" />
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
          isDarkMode ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-5 h-5 mt-0.5 flex-shrink-0" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
          <div>{error}</div>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className={`flex justify-center items-center py-3 px-4 rounded-xl mb-4 ${
          isDarkMode ? 'bg-gray-800/70 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-blue-500 mr-3"></div>
          <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Menghubungkan dengan Google...</span>
        </div>
      )}
      
      {/* Styled Custom Button (visible by default) */}
      {!isLoading && (
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={handleCustomButtonClick}
          className={`
            w-full py-3 px-4 flex justify-center items-center gap-3 rounded-xl font-medium 
            ${isDarkMode
              ? 'bg-gray-800/70 hover:bg-gray-700/70 border-gray-700 text-white'
              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
            } 
            border shadow-sm hover:shadow 
            transition-all duration-200
          `}
        >
          {renderGoogleIcon()}
          <span className="text-sm">{label}</span>
        </motion.button>
      )}
      
      {/* Hidden Google Button (for actual authentication) */}
      <div 
        ref={googleButtonRef}
        style={{ 
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
      ></div>
    </div>
  );
};

export default ModernGoogleAuthButton;