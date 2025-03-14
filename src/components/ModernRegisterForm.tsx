import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import ModernSocialLoginButton from "./ModernSocialLoginButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  isDarkMode: boolean;
}

const ModernRegisterForm: React.FC<RegisterFormProps> = ({ isDarkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Auth context dan router
  const { register } = useAuth();
  const router = useRouter();
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-3 strength

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Calculate password strength if password field is changed
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handleFocus = (field: 'name' | 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 0.5;
    if (/[a-z]/.test(password)) strength += 0.5;
    if (/[0-9]/.test(password)) strength += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 0.5;
    
    setPasswordStrength(Math.min(Math.floor(strength), 3));
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return "Lemah";
      case 1: return "Sedang";
      case 2: return "Kuat";
      case 3: return "Sangat Kuat";
      default: return "Lemah";
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return isDarkMode ? "bg-red-700" : "bg-red-500";
      case 1: return isDarkMode ? "bg-orange-600" : "bg-orange-500";
      case 2: return isDarkMode ? "bg-green-600" : "bg-green-500";
      case 3: return isDarkMode ? "bg-green-500" : "bg-green-600";
      default: return "bg-gray-300";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Gunakan service untuk registrasi melalui API
      await register(formData.name, formData.email, formData.password);
      
      // Jika sampai di sini, artinya pendaftaran berhasil
      setSuccess(true);
      
      // Redirect ke halaman survey setelah 1.5 detik
      setTimeout(() => {
        router.push('/survey');
      }, 1500);
      
    } catch (err) {
      // Menampilkan pesan error jika terjadi kesalahan
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      }
      setIsLoading(false);
    }
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
      {/* Error Message */}
      {error && (
        <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
          isDarkMode ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
          isDarkMode ? 'bg-green-900/30 text-green-200 border border-green-800' : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>Pendaftaran berhasil! Anda akan dialihkan ke halaman survey...</div>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Nama Lengkap
        </label>
        <motion.div 
          variants={inputVariants}
          animate={isFocused.name ? "focus" : "blur"}
          className={`
            flex items-center rounded-xl border 
            ${isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/80 border-gray-200'
            }
            px-4 py-3 
            ${isFocused.name 
              ? isDarkMode 
                ? 'ring-2 ring-blue-500/30 border-blue-400' 
                : 'ring-2 ring-blue-200 border-blue-300' 
              : ''
            }
            transition-all duration-200
          `}
        >
          <User className={`h-5 w-5 mr-3 ${
            isFocused.name
              ? isDarkMode ? 'text-blue-400' : 'text-blue-500'
              : isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } transition-colors`} />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={() => handleBlur('name')}
            placeholder="Masukkan nama lengkap"
            required
            className={`
              flex-1 bg-transparent outline-none text-sm
              ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'}
              transition-colors
            `}
          />
        </motion.div>
      </div>

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
        <label htmlFor="password" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Kata Sandi
        </label>
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
            placeholder="Min. 8 karakter"
            required
            minLength={8}
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

        {/* Password strength indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className={`h-4 w-4 ${
                  passwordStrength >= 2 
                    ? isDarkMode ? 'text-green-400' : 'text-green-500' 
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs font-medium ${
                  passwordStrength >= 2 
                    ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                    : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Kekuatan Kata Sandi
                </span>
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength === 0 ? (isDarkMode ? 'text-red-400' : 'text-red-500') :
                passwordStrength === 1 ? (isDarkMode ? 'text-orange-400' : 'text-orange-500') :
                passwordStrength === 2 ? (isDarkMode ? 'text-green-400' : 'text-green-500') :
                (isDarkMode ? 'text-green-400' : 'text-green-500')
              }`}>
                {getStrengthLabel()}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${getStrengthColor()}`}
                initial={{ width: '0%' }}
                animate={{ width: `${(passwordStrength + 1) * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Sandi harus memiliki minimal 8 karakter dengan kombinasi huruf dan angka
            </p>
          </div>
        )}
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-start py-1">
        <div className="relative flex items-center mt-0.5">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
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
        <label htmlFor="terms" className={`ml-2 block text-xs ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Saya menyetujui <span className="text-blue-500 hover:underline cursor-pointer">Syarat dan Ketentuan</span> serta <span className="text-blue-500 hover:underline cursor-pointer">Kebijakan Privasi</span> yang berlaku
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01, y: -1, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading || success}
          className={`
            w-full py-3 px-4 flex justify-center items-center 
            rounded-xl text-white font-medium
            ${isDarkMode
              ? 'bg-gradient-to-r from-indigo-600 to-purple-700'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600'
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
          ) : success ? (
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              <span>Berhasil Terdaftar</span>
            </div>
          ) : (
            <>
              <span>Daftar</span>
              <ArrowRight className="ml-2 h-5 w-5" />
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
            atau daftar dengan
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <ModernSocialLoginButton 
        provider="google" 
        label="Lanjutkan dengan Google" 
        isDarkMode={isDarkMode} 
        onClick={() => console.log("Google register")}
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

export default ModernRegisterForm;