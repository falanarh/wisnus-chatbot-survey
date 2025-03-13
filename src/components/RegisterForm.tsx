import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import SocialLoginButton from "./SocialLoginButton";

interface RegisterFormProps {
  isDarkMode: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ isDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Registration data:", formData);
      setIsLoading(false);
      // Handle success (would navigate to login or dashboard)
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Nama Lengkap
        </label>
        <div className={`flex items-center rounded-lg border ${
          isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
        } px-3 py-2 focus-within:ring-2 ${
          isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
        } transition-all`}>
          <User className={`h-5 w-5 mr-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Email
        </label>
        <div className={`flex items-center rounded-lg border ${
          isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
        } px-3 py-2 focus-within:ring-2 ${
          isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
        } transition-all`}>
          <Mail className={`h-5 w-5 mr-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nama@email.com"
            required
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Kata Sandi
        </label>
        <div className={`flex items-center rounded-lg border ${
          isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200'
        } px-3 py-2 focus-within:ring-2 ${
          isDarkMode ? 'focus-within:ring-blue-500/50' : 'focus-within:ring-blue-300'
        } transition-all`}>
          <Lock className={`h-5 w-5 mr-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 8 karakter"
            required
            minLength={8}
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`p-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700`}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Sandi harus memiliki minimal 8 karakter
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 px-4 flex justify-center items-center rounded-lg text-white font-medium ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
          } shadow-md hover:shadow-lg transition-all duration-200`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span>Daftar</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </motion.button>
      </div>

      {/* OR Divider */}
      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
        </div>
        <div className="relative flex justify-center">
          <span className={`px-2 ${isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-white/70 text-gray-500'} text-sm`}>
            atau daftar dengan
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <SocialLoginButton 
        provider="google" 
        label="Lanjutkan dengan Google" 
        isDarkMode={isDarkMode} 
        onClick={() => console.log("Google register")}
      />
    </form>
  );
};

export default RegisterForm;