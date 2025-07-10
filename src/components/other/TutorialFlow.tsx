import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
} from "lucide-react";
import { useTheme } from './ThemeProvider';

// --- Konfigurasi dan Data ---
const tutorialSteps: Array<{
  icon?: React.ElementType;
  image?: string; // URL or import for image/gif
  title: string;
  description: string;
}> = [
  {
    // Example using an image/gif (replace with your own path or URL)
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142945/chatbot_empty_jngico.png", // You can use a gif or any image here
    title: "Kuesioner Percakapan",
    description:
      "Platform kuesioner baru yang dirancang untuk melakukan survei secara virtual dengan AI seperti melakukan percakapan dengan manusia. Anda dapat menjawab pertanyaan dan bertanya terkait survei.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_mode_survei2_fnxjxd.png",
    title: "Survei Virtual",
    description:
      "Anda akan melakukan interaksi survei secara virtual dengan AI. Setiap jawaban Anda atas pertanyaan survei akan direspons dengan sesuai dan disimpan oleh AI.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142946/chatbot_mode_survei_tanya_zfs4ac.png",
    title: "Bertanya Terkait Survei",
    description:
      "Di tengah percakapan, Anda dapat bertanya terkait konteks pertanyaan survei. AI akan menjawab pertanyaan Anda dengan sesuai.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_mode_qna2_sijhuv.png",
    title: "Bebas Bertanya",
    description:
      "Anda dapat bertanya terkait konteks yang lebih umum dan tidak terikat dengan pertanyaan survei. AI menggunakan pengetahuan yang sudah dilatih untuk menjawab pertanyaan Anda.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752142447/chatbot_progress2_q1igjy.png",
    title: "Cek Progress Survei",
    description:
      "Terdapat tombol mengambang pada layar yang dapat Anda klik untuk melihat progress survei Anda.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752144356/chatbot_progress_detail2_ntzlln.png",
    title: "Lihat Jawaban Survei",
    description:
      "Ketika tombol progress survei diklik, Anda akan melihat jawaban Anda terhadap setiap pertanyaan survei.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752138528/chatbot_edit_jawaban_r5sygr.png",
    title: "Ubah Jawaban",
    description:
      "Anda dapat mengubah jawaban setiap pertanyaan survei dengan menekan tombol edit pada halaman progress survei. Lalu, anda dapat mengetik ulang jawaban yang diinginkan untuk mengubah jawaban.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752149859/chatbot_login_pawfkw.png",
    title: "SSO Login",
    description:
      "Anda dapat melakukan login dengan menggunakan akun Google. Sebagai opsi lain, Anda dapat melakukan registrasi dengan mengisi form Daftar di halaman Login.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752149860/chatbot_start_jphcfl.png",
    title: "Mulai Survei",
    description:
      "Untuk masuk ke halaman survei, Anda dapat menekan tombol Mulai Survei pada halaman Beranda.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752150441/chatbot_uniqe_code_arekpq.png",
    title: "Input Kode Unik",
    description:
      "Sebelum membuka halaman survei, Anda diminta memasukkan kode unik yang telah diberikan dalam undangan survei.",
  },
  {
    image: "https://res.cloudinary.com/dnhtklnsk/image/upload/v1752150441/chatbot_survey_intent_xvts7f.png",
    title: "Kesiapan Partisipasi Survei",
    description:
      "Untuk memulai sesi survei, Anda dapat mengirimkan pesan yang menyatakan kesiapan untuk memulai survei. AI akan merespons pesan Anda dengan sesuai.",
  },
];

// --- Komponen Utama Aplikasi ---
type TutorialFlowProps = {
  onFinish?: () => void;
};

const TutorialFlow: React.FC<TutorialFlowProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const activeStep = tutorialSteps[currentStep];
  const Icon = activeStep.icon;
  const { theme } = useTheme();

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Latar Belakang Gradien Animasi */}
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-slate-800`}
        />
      </AnimatePresence>

      {/* Konten Utama */}
      <main className="relative z-10 flex items-center justify-center w-full h-full py-4 px-6 md:p-8">
        <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Sisi Kiri: Visual Ikon */}
          <div className="relative flex items-center justify-center h-64 md:h-full">
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
                {/* Efek Cahaya (Glow) */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-300/40'}`}
                />
                {activeStep.image ? (
                  <img
                    src={activeStep.image}
                    alt={activeStep.title}
                    className="relative z-10  max-h-80 object-contain rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 bg-white/80 dark:bg-slate-900/80"
                  />
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

          {/* Sisi Kanan: Teks & Kontrol */}
          <div className="flex flex-col text-gray-800 dark:text-white text-center md:text-left">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                >
                  <h1 className="text-2xl md:text-5xl mt-4 font-bold leading-tight">
                    {activeStep.title}
                  </h1>
                  <p className="my-4 text-md text-gray-600 dark:text-gray-400 max-w-md mx-auto md:mx-0">
                    {activeStep.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigasi & Paginasi */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center md:items-start mt-6"
            >
              <div className="flex gap-3 mb-6">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
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
                    className="text-gray-600 dark:text-gray-400 hover:underline transition-colors"
                  >
                    Kembali
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600`}
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
