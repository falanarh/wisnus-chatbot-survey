// "use client";

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { Merriweather_Sans } from "next/font/google";
// import { motion } from "framer-motion";
// import { Star, MapPin, ChevronDown, ChevronRight, MapIcon, Calendar, Users } from "lucide-react";

// const merriweatherSans = Merriweather_Sans({
//   variable: "--font-merriweather-sans",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

// export default function Home() {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//   };

//   const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3
//       }
//     }
//   };

//   const floatAnimation = {
//     y: [0, -10, 0],
//     transition: {
//       duration: 4,
//       repeat: Infinity,
//       ease: "easeInOut"
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center relative overflow-hidden
//                     bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100
//                     dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
//       {/* Grid Background */}
//       <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
//         backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
//                           linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
//         backgroundSize: '30px 30px'
//       }}></div>

//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
//       </div>

//       {/* Decorative Elements */}
//       <motion.div
//         animate={floatAnimation}
//         className="absolute top-20 right-[15%] hidden md:block">
//         <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
//           <Star className="w-6 h-6 text-yellow-400" />
//         </div>
//       </motion.div>

//       <motion.div
//         animate={floatAnimation}
//         transition={{ delay: 1 }}
//         className="absolute bottom-40 left-[15%] hidden md:block">
//         <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
//           <MapPin className="w-6 h-6 text-blue-500" />
//         </div>
//       </motion.div>

//       {/* Subtle Dots Pattern */}
//       <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
//         backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
//         backgroundSize: '20px 20px'
//       }}></div>

//       {/* Main Content */}
//       <motion.div
//         initial="hidden"
//         animate={isLoaded ? "visible" : "hidden"}
//         variants={staggerContainer}
//         className="z-10 mt-[100px] w-full max-w-4xl px-4"
//       >
//         <motion.div variants={fadeIn} className="flex justify-center mb-2">
//           <div className="bg-blue-100/50 dark:bg-blue-900/30 px-4 py-1 rounded-full backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
//             <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">BPS Republik Indonesia</span>
//           </div>
//         </motion.div>

//         <motion.h1
//           variants={fadeIn}
//           className={`md:max-w-[700px] mx-auto px-5 ${merriweatherSans.className} text-xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold text-blue-800 dark:text-blue-300 md:leading-[3rem] lg:leading-[3.5rem]`}
//         >
//           Asisten AI untuk Survei Digital Wisatawan Nusantara!
//         </motion.h1>

//         <motion.p
//           variants={fadeIn}
//           className={`my-4 px-4 text-sm sm:text-base text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto`}
//         >
//           Permudah wawancara, otomatisasi survei, dan nikmati interaksi yang personal dengan platform AI
//           yang dirancang khusus untuk kebutuhan Wisatawan Nusantara.
//         </motion.p>

//         <motion.div
//           variants={fadeIn}
//           className="flex justify-center gap-4 my-4"
//         >
//           <a className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
//             <span>Pelajari lebih lanjut</span>
//             <ChevronDown className="w-4 h-4" />
//           </a>

//           <a className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
//             <span>Tentang BPS</span>
//             <ChevronRight className="w-4 h-4" />
//           </a>
//         </motion.div>
//       </motion.div>

//       {/* Feature Cards above Hero */}
//       <motion.div
//         initial="hidden"
//         animate={isLoaded ? "visible" : "hidden"}
//         variants={staggerContainer}
//         className="z-10 flex flex-wrap justify-center gap-4 px-4 mb-8"
//       >
//         {[
//           { icon: <MapIcon className="w-5 h-5 text-rose-500" />, title: "Destinasi Populer", desc: "Informasi terbaru" },
//           { icon: <Calendar className="w-5 h-5 text-green-500" />, title: "Survei Terjadwal", desc: "Pengumpulan data efisien" },
//           { icon: <Users className="w-5 h-5 text-amber-500" />, title: "Analisis Pengunjung", desc: "Pola kunjungan wisata" },
//         ].map((feature, idx) => (
//           <motion.div
//             key={idx}
//             variants={fadeIn}
//             whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
//             className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-md w-full max-w-[180px]"
//           >
//             <div className="flex items-center gap-2 mb-1">
//               <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700">
//                 {feature.icon}
//               </div>
//               <h3 className="font-medium text-sm dark:text-white">{feature.title}</h3>
//             </div>
//             <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Hero Image */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, delay: 0.2 }}
//         className='z-10 relative'
//       >
//         <div className="absolute -top-4 left-[20%] hidden md:block">
//           <motion.div
//             animate={{
//               y: [0, -10, 0],
//               rotate: [0, 5, 0]
//             }}
//             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//             className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg shadow-lg"
//           >
//             <span className="text-xs font-medium text-blue-700 dark:text-blue-300">250+ Destinasi</span>
//           </motion.div>
//         </div>

//         <div className="absolute -top-2 right-[25%] hidden md:block">
//           <motion.div
//             animate={{
//               y: [0, -8, 0],
//               rotate: [0, -3, 0]
//             }}
//             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//             className="bg-rose-50 dark:bg-rose-900/40 p-3 rounded-lg shadow-lg"
//           >
//             <div className="flex items-center gap-1">
//               <span className="text-xs font-medium text-rose-700 dark:text-rose-300">Akurat</span>
//               <div className="flex">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} className="w-3 h-3 text-rose-500 dark:text-rose-400" fill="#e11d48" />
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <Image
//           src="/hero_pict.svg"
//           alt="Hero Picture"
//           width={900}
//           height={900}
//           className="mt-2 w-full max-w-[900px] h-auto rounded-lg dark:brightness-90 dark:contrast-125"
//         />

//         {/* Decorative Circles */}
//         <div className="absolute -z-10 -top-8 -left-8 w-20 h-20 rounded-full border-4 border-dashed border-blue-100 dark:border-blue-900 opacity-60"></div>
//         <div className="absolute -z-10 -bottom-10 -right-5 w-16 h-16 rounded-full border-4 border-dashed border-rose-100 dark:border-rose-900 opacity-60"></div>

//         {/* Call to action buttons with enhanced styling */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="absolute -bottom-[120px] md:bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col bg-blue-400/40 dark:bg-blue-600/30 backdrop-blur-md w-40 md:w-48 p-3 rounded-3xl gap-2 shadow-lg border border-white/30 dark:border-white/10"
//         >
//           <motion.a
//             whileHover={{ scale: 1.05, y: -5 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 px-6 py-2 rounded-2xl text-center font-bold text-white text-sm md:text-[16px] cursor-pointer shadow-md flex items-center justify-center gap-1"
//           >
//             <span>Panduan</span>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </motion.a>

//           <motion.a
//             href="/survey"
//             whileHover={{ scale: 1.05, y: 5 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-700 px-6 py-2 rounded-2xl text-center text-white font-bold text-sm md:text-[16px] cursor-pointer shadow-md"
//           >
//             Mulai Survei
//           </motion.a>
//         </motion.div>
//       </motion.div>

//       {/* Statistics Counters */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1, delay: 1.2 }}
//         className="z-10 w-full max-w-4xl flex justify-center gap-8 mt-[150px] md:mt-[50px] mb-12 px-4"
//       >
//         {[
//           { value: "25,000+", label: "Responden" },
//           { value: "34+", label: "Provinsi" },
//           { value: "98%", label: "Akurasi" }
//         ].map((stat, idx) => (
//           <div key={idx} className="text-center">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 1.5 + idx * 0.2 }}
//               className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400"
//             >
//               {stat.value}
//             </motion.div>
//             <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Merriweather_Sans } from "next/font/google";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, ChevronRight, Calendar, Users, Star } from "lucide-react";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden
                    bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100
                    dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
        backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                          linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }}></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={floatAnimation}
        className="absolute top-20 right-[15%] hidden md:block">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
          <MapPin className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>

      <motion.div
        animate={floatAnimation}
        transition={{ delay: 1 }}
        className="absolute bottom-40 left-[15%] hidden md:block">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
      </motion.div>

      {/* Subtle Dots Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
        backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={staggerContainer}
        className="z-10 mt-[80px] w-full max-w-4xl px-4"
      >
        <motion.div variants={fadeIn} className="flex justify-center mb-2">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 px-4 py-1 rounded-full backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">BPS Republik Indonesia</span>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className={`md:max-w-[700px] mx-auto px-5 ${merriweatherSans.className} text-xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold text-blue-800 dark:text-blue-300 md:leading-[3rem] lg:leading-[3.5rem]`}
        >
          Survei Digital Wisatawan Nusantara 2025
        </motion.h1>

        <motion.p
          variants={fadeIn}
          className={`my-4 px-2 md:px-0 text-sm sm:text-base text-center text-gray-700 dark:text-gray-300 w-full mx-auto`}
        >
          Kegiatan rutin Badan Pusat Statistik untuk mengumpulkan data wisatawan nusantara yang melakukan
          perjalanan di wilayah Indonesia. Data ini sangat dibutuhkan dalam penyusunan rencana dan kebijakan di bidang pariwisata.
        </motion.p>

        <motion.div
          variants={fadeIn}
          className="flex justify-center gap-4 mt-4 mb-7"
        >
          <a className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            <span>Pelajari lebih lanjut</span>
            <ChevronDown className="w-4 h-4" />
          </a>

          <a className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            <span>Tentang BPS</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='z-10 relative'
      >
        <div className="absolute -top-3 left-[20%] hidden md:block z-50">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg shadow-lg"
          >
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Big Data Methodology</span>
          </motion.div>
        </div>

        <div className="absolute -top-3 right-[20%] hidden md:block z-50">
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="bg-rose-50 dark:bg-rose-900/40 p-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-300">Self Enumeration Survey</span>
            </div>
          </motion.div>
        </div>

        <Image
          src="/hero_pict.svg"
          alt="Hero Picture"
          width={650}
          height={650}
          className="mt-2 w-full mx-auto max-w-[650px] h-auto rounded-lg dark:brightness-90 dark:contrast-125"
        />

        {/* Feature Cards above Hero - Updated with book information */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={staggerContainer}
          className="z-10 flex flex-wrap justify-center gap-4 px-4 my-6"
        >
          {[
            { icon: <MapPin className="w-5 h-5 text-rose-500" />, title: "Wisatawan Nusantara", desc: "Seseorang yang melakukan perjalanan di wilayah Indonesia dengan lama < 12 bulan" },
            { icon: <Calendar className="w-5 h-5 text-green-500" />, title: "Perjalanan Wisata", desc: "Berwisata ke objek wisata atau mengunjungi Kab/Kota lain minimal 6 jam" },
            { icon: <Users className="w-5 h-5 text-amber-500" />, title: "Mobile Positioning", desc: "Pemanfaatan data posisi seluler untuk analisis statistik perjalanan" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-md w-full max-w-[230px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-sm dark:text-white">{feature.title}</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>


        {/* Decorative Circles */}
        <div className="absolute -z-10 -top-8 -left-8 w-20 h-20 rounded-full border-4 border-dashed border-blue-100 dark:border-blue-900 opacity-60"></div>
        <div className="absolute -z-10 -bottom-10 -right-5 w-16 h-16 rounded-full border-4 border-dashed border-rose-100 dark:border-rose-900 opacity-60"></div>
          {/* Call to action buttons with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -bottom-[120px] md:bottom-[160px] left-[38%] flex flex-col bg-blue-400/40 dark:bg-blue-600/30 backdrop-blur-md w-40 md:w-48 p-3 rounded-3xl gap-2 shadow-lg border border-white/30 dark:border-white/10"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 px-6 py-2 rounded-2xl text-center font-bold text-white text-sm md:text-[16px] cursor-pointer shadow-md flex items-center justify-center gap-1"
            >
              <span>Panduan</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>

            <motion.a
              href="/survey"
              whileHover={{ scale: 1.05, y: 5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-600 dark:to-purple-700 px-6 py-2 rounded-2xl text-center text-white font-bold text-sm md:text-[16px] cursor-pointer shadow-md"
            >
              Mulai Survei
            </motion.a>
          </motion.div>
      </motion.div>


      {/* Statistics Counters - Updated with book information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="z-10 w-full max-w-4xl flex justify-center gap-8 mt-[150px] md:mt-[0px] mb-12 px-4"
      >
        {[
          { value: "38", label: "Provinsi" },
          { value: "514", label: "Kabupaten/Kota" },
          { value: "6", label: "Bulan" }
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + idx * 0.2 }}
              className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400"
            >
              {stat.value}
            </motion.div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div >
  );
}