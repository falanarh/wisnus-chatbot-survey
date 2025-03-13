import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import ModernSocialLoginButton from "./ModernSocialLoginButton";

interface LoginFormProps {
  isDarkMode: boolean;
}

const ModernLoginForm: React.FC<LoginFormProps> = ({ isDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Login data:", formData);
      setIsLoading(false);
      // Handle success (would navigate to dashboard)
    }, 1500);
  };

  // Input field animation variants
  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Email
        </label>
        <motion.div 
          variants={inputVariants}
          animate={isFocused.email ? "focus" : "blur"}
          className={`
            flex items-center rounded-xl border 
            ${isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/80 border-gray-200'
            }
            px-4 py-3 
            ${isFocused.email 
              ? isDarkMode 
                ? 'ring-2 ring-blue-500/30 border-blue-400' 
                : 'ring-2 ring-blue-200 border-blue-300' 
              : ''
            }
            transition-all duration-200
          `}
        >
          <Mail className={`h-5 w-5 mr-3 ${
            isFocused.email
              ? isDarkMode ? 'text-blue-400' : 'text-blue-500'
              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } transition-colors`} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            placeholder="nama@email.com"
            required
            className={`
              flex-1 bg-transparent outline-none text-sm
              ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'}
              transition-colors
            `}
          />
        </motion.div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Kata Sandi
          </label>
          <Link 
            href="/forgot-password" 
            className={`
              text-xs font-medium relative overflow-hidden group
              ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
            `}
          >
            <span className="relative z-10 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
              Lupa Kata Sandi?
            </span>
            <span className="absolute inset-0 bg-blue-500 dark:bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-sm"></span>
          </Link>
        </div>
        <motion.div 
          variants={inputVariants}
          animate={isFocused.password ? "focus" : "blur"}
          className={`
            flex items-center rounded-xl border 
            ${isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/80 border-gray-200'
            }
            px-4 py-3 
            ${isFocused.password 
              ? isDarkMode 
                ? 'ring-2 ring-blue-500/30 border-blue-400' 
                : 'ring-2 ring-blue-200 border-blue-300' 
              : ''
            }
            transition-all duration-200
          `}
        >
          <Lock className={`h-5 w-5 mr-3 ${
            isFocused.password
              ? isDarkMode ? 'text-blue-400' : 'text-blue-500'
              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } transition-colors`} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={() => handleBlur('password')}
            placeholder="Masukkan kata sandi"
            required
            className={`
              flex-1 bg-transparent outline-none text-sm
              ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'}
              transition-colors
            `}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`
              p-1.5 rounded-full
              ${isDarkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }
              transition-colors
            `}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center py-1">
        <div className="relative flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className={`
              h-4 w-4 rounded-sm border-2 focus:ring-0 focus:ring-offset-0
              ${isDarkMode 
                ? 'border-gray-600 bg-gray-800 checked:bg-blue-500 checked:border-blue-500' 
                : 'border-gray-300 bg-white checked:bg-blue-500 checked:border-blue-500'
              }
              appearance-none cursor-pointer
            `}
          />
          <div className="absolute left-0 w-4 h-4 flex items-center justify-center pointer-events-none text-white opacity-0 check-mark">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <label htmlFor="remember-me" className={`ml-2 block text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Ingat saya
        </label>
      </div>

      {/* Login Button */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01, y: -1, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-3 px-4 flex justify-center items-center 
            rounded-xl text-white font-medium
            ${isDarkMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }
            shadow-md transition-all duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Memproses...</span>
            </div>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              <span>Masuk</span>
            </>
          )}
        </motion.button>
      </div>

      {/* OR Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDarkMode ? 'border-gray-700/70' : 'border-gray-200/70'}`}></div>
        </div>
        <div className="relative flex justify-center">
          <span className={`
            px-3 text-sm
            ${isDarkMode ? 'bg-gray-900/70 text-gray-400' : 'bg-white/70 text-gray-500'}
          `}>
            atau masuk dengan
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <ModernSocialLoginButton 
        provider="google" 
        label="Lanjutkan dengan Google" 
        isDarkMode={isDarkMode} 
        onClick={() => console.log("Google login")}
      />
      
      <style jsx>{`
        .check-mark {
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.2s ease;
        }
        
        input[type="checkbox"]:checked + .check-mark {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </form>
  );
};

export default ModernLoginForm;