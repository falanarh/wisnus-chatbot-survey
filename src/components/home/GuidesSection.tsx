"use client";

import { motion } from "framer-motion";
import { Book, CheckCircle, MessageCircleQuestion, ListChecks, Play } from "lucide-react";
import { Merriweather_Sans } from "next/font/google";
import Image from "next/image";
import { resetTutorialState } from '@/utils/otherUtils';

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const GuidesSection: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const guideItems = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Persiapan",
      description: "Katakan bahwa Anda siap untuk mengisi survei. Survei akan dimulai setelah Anda menyatakan siap untuk mengikuti survei."
    },
    {
      icon: <MessageCircleQuestion className="w-6 h-6" />,
      title: "Bertanya/Menjawab",
      description: "Ada dua mode dalam kuesioner, Tanya Jawab untuk bertanya terkait survei secara umum dan Survei untuk mengisi jawaban pertanyaan."
    },
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Penyelesaian",
      description: "Anda dapat bertanya terkait pertanyaan tertentu secara langsung dan pastikan Anda menjawab semua pertanyaan dengan baik."
    }
  ];

  const handleStartTutorial = () => {
    // Reset tutorial state to show tutorial again
    resetTutorialState();
    // Reload the page to trigger tutorial flow
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 relative" id="guides">
      {/* Background decoration */}
      <div className="absolute right-0 top-40 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute left-0 bottom-40 w-60 h-60 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 blur-3xl -z-10"></div>

      <div className="container max-w-4xl px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
            <Book className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className={`${merriweatherSans.className} text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300`}>
            Panduan Survei
          </h2>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center text-[14px] sm:text-[16px] text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Ikuti panduan berikut untuk membantu Anda mengisi survei dengan lancar dan efisien.
          Panduan ini akan membantu Anda memahami proses survei secara keseluruhan.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {guideItems.map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg w-fit mb-4">
                <div className="text-blue-500 dark:text-blue-400">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-justify text-gray-600 dark:text-gray-300 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="mt-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 p-6 rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-800/30 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/3 relative">
              <Image
                src="/guide-illustration.svg"
                alt="Panduan Survei"
                width={250}
                height={250}
                className="mx-auto"
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className={`${merriweatherSans.className} text-xl font-bold text-blue-800 dark:text-blue-300 mb-3`}>
                Lihat Tutorial Interaktif
              </h3>
              <p className="text-justify text-gray-700 dark:text-gray-300 text-sm mb-4">
                Untuk pemahaman yang lebih baik, Anda dapat melihat tutorial interaktif yang akan 
                menjelaskan setiap fitur dan cara menggunakan platform survei digital wisatawan nusantara.
              </p>
              <motion.button
                onClick={handleStartTutorial}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Mulai Tutorial
              </motion.button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-200 dark:bg-blue-700 rounded-full opacity-30 -z-10"></div>
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-indigo-200 dark:indigo-700 rounded-full opacity-30 -z-10"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default GuidesSection;