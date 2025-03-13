"use client";

import { motion } from "framer-motion";
import { Info, Users, BarChart, Globe } from "lucide-react";
import { Merriweather_Sans } from "next/font/google";
import Image from "next/image";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const AboutSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 relative" id="about">
      {/* Background decoration */}
      <div className="absolute left-0 top-40 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute right-0 bottom-20 w-60 h-60 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-3xl -z-10"></div>

      <div className="container max-w-4xl px-4 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
            <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <h2 className={`${merriweatherSans.className} text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300`}>
            Tentang BPS
          </h2>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Badan Pusat Statistik adalah Lembaga Pemerintah Non-Kementerian yang bertanggung jawab langsung
          kepada Presiden. BPS menyediakan data statistik berkualitas untuk Indonesia yang lebih baik.
        </motion.p>

        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      Visi
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Penyedia Data Statistik Berkualitas untuk Indonesia Maju
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg">
                    <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      Misi
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Menyediakan statistik berkualitas yang berstandar nasional 
                      dan internasional melalui proses yang transparan dan akuntabel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="md:w-1/2 flex items-center justify-center"
          >
            <div className="relative p-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl shadow-lg max-w-sm">
              <Image
                src="/bps_building.jpg"
                alt="Kantor BPS"
                width={400}
                height={300}
                className="rounded-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Kantor Pusat BPS</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 p-6 rounded-2xl shadow-lg border border-indigo-200/50 dark:border-indigo-800/30"
        >
          <h3 className={`${merriweatherSans.className} text-xl font-bold text-blue-800 dark:text-blue-300 mb-4`}>
            Tentang Survei Wisatawan Nusantara
          </h3>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Survei Wisatawan Nusantara adalah survei nasional yang dilakukan oleh Badan Pusat Statistik
              untuk mengumpulkan data mengenai perjalanan wisata dalam negeri yang dilakukan oleh penduduk Indonesia.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Data yang dikumpulkan antara lain mencakup karakteristik wisatawan, pola perjalanan,
              pengeluaran selama berwisata, serta persepsi terhadap destinasi wisata yang dikunjungi.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Hasil survei ini digunakan sebagai dasar perencanaan kebijakan dan pengembangan
              sektor pariwisata di Indonesia serta membantu pemerintah mengevaluasi efektivitas
              program-program pengembangan pariwisata.
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                <BarChart className="w-5 h-5 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Periode Survei</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Januari - Juni 2025</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
            >
              Lihat Hasil Survei Sebelumnya
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;