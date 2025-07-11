import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { useTheme } from './ThemeProvider';
import Image from "next/image";

// SVG Pattern untuk background
const BackgroundPattern = ({ theme }: { theme: string }) => (
  <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path
          d="M 30 0 L 0 0 0 30"
          fill="none"
          stroke={theme === 'dark' ? '#1F2937' : '#D1D5DB'}
          strokeWidth="1"
        />
      </pattern>
      <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle
          cx="2"
          cy="2"
          r="1.5"
          fill={theme === 'dark' ? '#374151' : '#E5E7EB'}
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

// --- Konfigurasi dan Data ---
type TutorialStep = {
  icon?: React.ElementType;
  images: {
    mobile: string;
    desktop: string;
  };
  title: string;
  description: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142945/chatbot_empty_jngico.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174629/desktop_empty_zg0dn4.png"
    },
    title: "Kuesioner Percakapan",
    description: "Platform kuesioner baru yang dirancang untuk melakukan survei secara virtual dengan AI seperti melakukan percakapan dengan manusia. Anda dapat menjawab pertanyaan dan bertanya terkait survei.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_mode_survei2_fnxjxd.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_mode_survei2_kbi8bk.png"
    },
    title: "Survei Virtual",
    description: "Anda akan melakukan interaksi survei secara virtual dengan AI. Setiap jawaban Anda atas pertanyaan survei akan direspons dengan sesuai dan disimpan oleh AI.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142946/chatbot_mode_survei_tanya_zfs4ac.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174629/desktop_mode_survei_tanya_k1vb2t.png"
    },
    title: "Bertanya Terkait Survei",
    description: "Di tengah percakapan, Anda dapat bertanya terkait konteks pertanyaan survei. AI akan menjawab pertanyaan Anda dengan sesuai.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_mode_qna2_sijhuv.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_mode_qna2_xz2tx0.png"
    },
    title: "Bebas Bertanya",
    description: "Anda dapat bertanya terkait konteks yang lebih umum dan tidak terikat dengan pertanyaan survei. AI menggunakan pengetahuan yang sudah dilatih untuk menjawab pertanyaan Anda.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_progress2_q1igjy.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_progess2_yi2wju.png"
    },
    title: "Cek Progress Survei",
    description: "Terdapat tombol mengambang pada layar yang dapat Anda klik untuk melihat progress survei Anda.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752144356/chatbot_progress_detail2_ntzlln.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174629/desktop_progress_detail_eznce6.png"
    },
    title: "Lihat Jawaban Survei",
    description: "Ketika tombol progress survei diklik, Anda akan melihat jawaban Anda terhadap setiap pertanyaan survei.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752138528/chatbot_edit_jawaban_r5sygr.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_edit_jawaban_davjrn.png"
    },
    title: "Ubah Jawaban",
    description: "Anda dapat mengubah jawaban setiap pertanyaan survei dengan menekan tombol edit pada halaman progress survei. Lalu, anda dapat mengetik ulang jawaban yang diinginkan untuk mengubah jawaban.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752149859/chatbot_login_pawfkw.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174628/desktop_login_rdwujp.png"
    },
    title: "SSO Login",
    description: "Anda dapat melakukan login dengan menggunakan akun Google. Sebagai opsi lain, Anda dapat melakukan registrasi dengan mengisi form Daftar di halaman Login.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752149860/chatbot_start_jphcfl.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_home2_fhkraj.png"
    },
    title: "Mulai Survei",
    description: "Untuk masuk ke halaman survei, Anda dapat menekan tombol Mulai Survei pada halaman Beranda.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752150441/chatbot_uniqe_code_arekpq.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174626/desktop_uniqe_code_rbxpfv.png"
    },
    title: "Input Kode Unik",
    description: "Sebelum membuka halaman survei, Anda diminta memasukkan kode unik yang telah diberikan dalam undangan survei.",
  },
  {
    images: {
      mobile: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752150441/chatbot_survey_intent_xvts7f.png",
      desktop: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752174627/desktop_survey_intent_hgyqfx.png"
    },
    title: "Kesiapan Partisipasi Survei",
    description: "Untuk memulai sesi survei, Anda dapat mengirimkan pesan yang menyatakan kesiapan untuk memulai survei. AI akan merespons pesan Anda dengan sesuai.",
  },
];

// --- Komponen Utama Aplikasi ---
type TutorialFlowProps = {
  onFinish?: () => void;
};

const TutorialFlow: React.FC<TutorialFlowProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const activeStep = tutorialSteps[currentStep];
  const Icon = activeStep.icon;
  const { theme } = useTheme();

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleStepChange = (newStep: number) => {
    setIsImageLoading(true);
    setCurrentStep(newStep);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      handleStepChange(currentStep + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setShowSkipConfirmation(true);
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirmation(false);
    if (onFinish) onFinish();
  };

  const handleCancelSkip = () => {
    setShowSkipConfirmation(false);
  };

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden font-sans">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className={`absolute top-4 right-4 z-20 px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 hover:scale-105
          ${theme === 'dark' 
            ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 backdrop-blur-sm' 
            : 'bg-white/80 text-gray-600 hover:bg-white/90 backdrop-blur-sm'}`}
      >
        Lewati Tutorial
      </button>

      {/* Skip Confirmation Popup */}
      <AnimatePresence>
        {showSkipConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCancelSkip}
            />
            
            {/* Popup Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl
                ${theme === 'dark' 
                  ? 'bg-gray-900/95 border border-gray-700' 
                  : 'bg-white/95 border border-gray-200'} backdrop-blur-md`}
            >
              {/* Close button */}
              <button
                onClick={handleCancelSkip}
                className={`absolute top-3 right-3 p-1 rounded-full transition-colors
                  ${theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                  <AlertTriangle 
                    size={32} 
                    className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} 
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold text-center mb-3
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Perhatikan Tutorial dengan Baik
              </h3>

              {/* Message */}
              <p className={`text-sm text-center mb-6 leading-relaxed
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Tutorial ini akan membantu Anda memahami cara menggunakan platform survei dengan lebih baik. 
                Apakah Anda yakin ingin melewati tutorial ini?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSkip}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Lanjutkan Tutorial
                </button>
                <button
                  onClick={handleConfirmSkip}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  Lewati Sekarang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latar Belakang dengan Pattern */}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0"
        >
          {/* Base gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900`} />
          
          {/* Pattern overlay */}
          <BackgroundPattern theme={theme} />
          
          {/* Radial gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-slate-900/40" />
        </motion.div>
      </AnimatePresence>

      {/* Konten Utama dengan enhanced shadows */}
      <main className="relative z-10 flex items-center justify-center w-full min-h-screen py-6 px-4 sm:px-6 md:p-8 md:py-12">
        <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 items-start md:items-center">
          {/* Sisi Kiri: Visual dengan enhanced container */}
          <div className="relative flex items-center justify-center h-[45vh] md:h-full pt-8 md:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  transition: { duration: 0.3, ease: "easeIn" },
                }}
                className="relative flex items-center justify-center"
              >
                {/* Enhanced glow effect */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl 
                    ${theme === 'dark' 
                      ? 'bg-indigo-500/10 mix-blend-overlay' 
                      : 'bg-indigo-300/30 mix-blend-multiply'}`}
                />
                
                {/* Content with glass effect */}
                {activeStep.images ? (
                  <div className={`relative z-10 p-2 rounded-2xl backdrop-blur-sm w-full max-w-[85vw] md:max-w-[90%]
                    ${theme === 'dark'
                      ? 'bg-gray-900/40 shadow-xl shadow-indigo-500/10'
                      : 'bg-white/40 shadow-xl shadow-indigo-300/20'}`}>
                  {/* Mobile Image */}
                  <div className="relative block md:hidden">
                    {isImageLoading && (
                      <div className="absolute inset-0 w-full min-h-[200px] max-h-[35vh] rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
                    )}
                    <Image
                      src={activeStep.images.mobile}
                      alt={`${activeStep.title} - Mobile View`}
                      width={500}
                      height={300}
                      priority={true}
                      quality={90}
                      onLoad={handleImageLoad}
                      className={`
                        w-full max-w-full h-auto
                        min-h-[200px] max-h-[35vh]
                        object-contain object-center
                        rounded-xl
                        transition-all duration-300 ease-in-out
                        ${isImageLoading ? 'opacity-0' : 'opacity-100'}
                      `}
                    />
                  </div>
                  
                  {/* Desktop Image */}
                  <div className="relative hidden md:block">
                    {isImageLoading && (
                      <div className="absolute inset-0 min-h-[250px] max-h-[400px] min-w-[350px] max-w-[500px] rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
                    )}
                    <Image
                      src={activeStep.images.desktop}
                      alt={`${activeStep.title} - Desktop View`}
                      width={800}
                      height={500}
                      priority={true}
                      quality={90}
                      onLoad={handleImageLoad}
                      className={`
                        w-auto h-auto
                        min-h-[250px] max-h-[400px]
                        min-w-[350px] max-w-[500px]
                        object-contain object-center
                        rounded-xl
                        transition-all duration-300 ease-in-out
                        ${isImageLoading ? 'opacity-0' : 'opacity-100'}
                      `}
                    />
                  </div>
                </div>
                ) : Icon ? (
                <Icon
                  size={120}
                    className={`relative z-10 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}
                  strokeWidth={1.5}
                />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sisi Kanan: Teks dengan enhanced container */}
          <div className={`flex flex-col text-center md:text-left p-4 sm:p-6 rounded-2xl backdrop-blur-sm mt-4 md:mt-0
            ${theme === 'dark'
              ? 'bg-gray-900/30 shadow-xl shadow-indigo-500/5'
              : 'bg-white/30 shadow-xl shadow-indigo-300/10'}`}>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                >
                  <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-4 font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-emerald-700'}`}>
                    {activeStep.title}
                  </h1>
                  <p className="my-2 sm:my-4 text-sm sm:text-md md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto md:mx-0 md:leading-relaxed">
                    {activeStep.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation dengan enhanced styling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center md:items-start mt-4 sm:mt-6"
            >
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStepChange(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep === index
                        ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                        : 'w-4 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Kembali
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 
                    bg-indigo-600 hover:bg-indigo-700 text-white 
                    dark:bg-indigo-500 dark:hover:bg-indigo-600
                    backdrop-blur-sm`}
                >
                  <span>
                    {currentStep === tutorialSteps.length - 1
                      ? "Mulai Sekarang"
                      : "Lanjutkan"}
                  </span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TutorialFlow;
