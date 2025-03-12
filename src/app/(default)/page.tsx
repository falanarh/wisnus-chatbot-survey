// // import Image from 'next/image';
// // import { Merriweather_Sans } from "next/font/google";

// // const merriweatherSans = Merriweather_Sans({
// //   variable: "--font-merriweather-sans",
// //   subsets: ["latin"],
// //   weight: ["400", "700"],
// // });

// // export default function Home() {
// //   return (
// //     <div className="min-h-screen flex flex-col items-center bg-white relative">
// //       <div className="absolute inset-0 opacity-40" style={{
// //         backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
// //                           linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
// //         backgroundSize: '30px 30px'
// //       }}></div>
// //       {/* Gradasi pojok kiri atas, agak menjauh dari pojok */}
// //       <div className="absolute top-40 left-10 w-64 h-64 rounded-full opacity-40 blur-3xl" style={{
// //         background: 'radial-gradient(circle, rgba(172, 23, 84, 1) 0%, rgba(255,255,255,0) 70%)',
// //       }}></div>
// //       {/* Gradasi pojok kanan bawah, agak menjauh dari pojok */}
// //       <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-40 blur-3xl" style={{
// //         background: 'radial-gradient(circle, rgba(23, 84, 172, 1) 0%, rgba(255,255,255,0) 70%)',
// //       }}></div>
// //       <div className="z-10 mt-[100px]">
// //         <h1 className={`md:w-[700px] px-5 ${merriweatherSans.className} text-xl sm:text-3xl md:text-4xl text-center font-bold text-[#1E40AF] md:leading-[3rem]`}>
// //           Asisten AI untuk Survei Digital Wisatawan Nusantara!
// //         </h1>
// //         <p className={`my-2 px-4 text-sm sm:text-md text-center text-black`}>
// //           Permudah wawancara, otomatisasi survei, dan nikmati interaksi yang personal dengan platform AI.
// //         </p>
// //       </div>
// //       <div className='z-10 relative'>
// //         <Image
// //           src="/hero_pict.svg"
// //           alt="Hero Picture"
// //           width={900}
// //           height={900}
// //           className="mt-2 w-full max-w-[900px] h-auto"
// //         />
// //         <div className="absolute -bottom-[120px] md:bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col bg-[#ac175575] w-30 md:w-40 p-2 rounded-3xl gap-1">
// //           <a
// //             className="bg-[#41bf28] hover:bg-[#41bf28] hover:scale-[1.115] hover:translate-y-[-7px] hover:rounded-[23px] hover:rounded-bl-none hover:rounded-br-none px-6 py-2 rounded-2xl rounded-bl-lg rounded-br-lg transition-all text-center font-bold text-white text-sm md:text-[16px] cursor-pointer"
// //           >Panduan
// //           </a>
// //           <a
// //             className="bg-[#ff9b29] hover:bg-secondary-600 hover:scale-[1.115] hover:translate-y-[7px] hover:rounded-[23px] hover:rounded-tl-none hover:rounded-tr-none px-6 py-2 rounded-2xl rounded-tl-lg rounded-tr-lg transition-all text-center text-white font-bold text-sm md:text-[16px] cursor-pointer"
// //           >
// //             Mulai Survei
// //           </a>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// //app/page.tsx

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
//     <div className="min-h-screen flex flex-col items-center bg-white relative overflow-hidden">
//       {/* Grid Background */}
//       <div className="absolute inset-0 opacity-30" style={{
//         backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
//                           linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
//         backgroundSize: '30px 30px'
//       }}></div>
      
//       {/* Animated Gradients */}
//       <motion.div 
//         animate={{ rotate: 360 }}
//         transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
//         className="absolute top-40 left-10 w-72 h-72 rounded-full opacity-40 blur-3xl" 
//         style={{
//           background: 'radial-gradient(circle, rgba(172, 23, 84, 1) 0%, rgba(255,255,255,0) 70%)',
//         }}
//       ></motion.div>
      
//       <motion.div 
//         animate={{ rotate: -360 }}
//         transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
//         className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-40 blur-3xl" 
//         style={{
//           background: 'radial-gradient(circle, rgba(23, 84, 172, 1) 0%, rgba(255,255,255,0) 70%)',
//         }}
//       ></motion.div>
      
//       {/* Additional Gradient Decorations */}
//       <motion.div 
//         animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
//         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full opacity-30 blur-3xl" 
//         style={{
//           background: 'radial-gradient(circle, rgba(255, 153, 0, 1) 0%, rgba(255,255,255,0) 70%)',
//         }}
//       ></motion.div>
      
//       <motion.div 
//         animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
//         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//         className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full opacity-30 blur-3xl" 
//         style={{
//           background: 'radial-gradient(circle, rgba(76, 211, 136, 1) 0%, rgba(255,255,255,0) 70%)',
//         }}
//       ></motion.div>
      
//       {/* Decorative Elements */}
//       <motion.div 
//         animate={floatAnimation}
//         className="absolute top-20 right-[15%] hidden md:block">
//         <div className="bg-white p-2 rounded-full shadow-lg">
//           <Star className="w-6 h-6 text-yellow-400" />
//         </div>
//       </motion.div>
      
//       <motion.div 
//         animate={floatAnimation}
//         transition={{ delay: 1 }}
//         className="absolute bottom-40 left-[15%] hidden md:block">
//         <div className="bg-white p-2 rounded-full shadow-lg">
//           <MapPin className="w-6 h-6 text-blue-500" />
//         </div>
//       </motion.div>
      
//       {/* Subtle Dots Pattern */}
//       <div className="absolute inset-0 opacity-10" style={{
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
//           <div className="bg-blue-100/50 px-4 py-1 rounded-full backdrop-blur-sm border border-blue-200/40 flex items-center gap-2">
//             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
//             <span className="text-xs text-blue-700 font-medium">BPS Republik Indonesia</span>
//           </div>
//         </motion.div>
        
//         <motion.h1 
//           variants={fadeIn}
//           className={`md:max-w-[700px] mx-auto px-5 ${merriweatherSans.className} text-xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold text-[#1E40AF] md:leading-[3rem] lg:leading-[3.5rem]`}
//         >
//           Asisten AI untuk Survei Digital Wisatawan Nusantara!
//         </motion.h1>
        
//         <motion.p 
//           variants={fadeIn}
//           className={`my-4 px-4 text-sm sm:text-base text-center text-gray-700 max-w-2xl mx-auto`}
//         >
//           Permudah wawancara, otomatisasi survei, dan nikmati interaksi yang personal dengan platform AI
//           yang dirancang khusus untuk kebutuhan Wisatawan Nusantara.
//         </motion.p>
        
//         <motion.div 
//           variants={fadeIn}
//           className="flex justify-center gap-4 my-4"
//         >
//           <a className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
//             <span>Pelajari lebih lanjut</span>
//             <ChevronDown className="w-4 h-4" />
//           </a>
          
//           <a className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
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
//             className="bg-white/80 backdrop-blur-sm border border-gray-100 p-3 rounded-xl shadow-md w-full max-w-[180px]"
//           >
//             <div className="flex items-center gap-2 mb-1">
//               <div className="p-1.5 rounded-lg bg-gray-50">
//                 {feature.icon}
//               </div>
//               <h3 className="font-medium text-sm">{feature.title}</h3>
//             </div>
//             <p className="text-xs text-gray-500">{feature.desc}</p>
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
//             className="bg-blue-50 p-3 rounded-lg shadow-lg"
//           >
//             <span className="text-xs font-medium text-blue-700">250+ Destinasi</span>
//           </motion.div>
//         </div>
        
//         <div className="absolute -top-2 right-[25%] hidden md:block">
//           <motion.div 
//             animate={{
//               y: [0, -8, 0],
//               rotate: [0, -3, 0]
//             }}
//             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//             className="bg-rose-50 p-3 rounded-lg shadow-lg"
//           >
//             <div className="flex items-center gap-1">
//               <span className="text-xs font-medium text-rose-700">Akurat</span>
//               <div className="flex">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} className="w-3 h-3 text-rose-500" fill="#e11d48" />
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
//           className="mt-2 w-full max-w-[900px] h-auto rounded-lg"
//         />
        
//         {/* Decorative Circles */}
//         <div className="absolute -z-10 -top-8 -left-8 w-20 h-20 rounded-full border-4 border-dashed border-blue-100 opacity-60"></div>
//         <div className="absolute -z-10 -bottom-10 -right-5 w-16 h-16 rounded-full border-4 border-dashed border-rose-100 opacity-60"></div>
        
//         {/* Call to action buttons with enhanced styling */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.8 }}
//           className="absolute -bottom-[120px] md:bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col bg-[#ac175575] backdrop-blur-md w-40 md:w-48 p-3 rounded-3xl gap-2 shadow-lg border border-white/30"
//         >
//           <motion.a
//             whileHover={{ scale: 1.05, y: -5 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-[#41bf28] to-[#34a71f] hover:from-[#34a71f] hover:to-[#2d8f1b] px-6 py-2 rounded-2xl text-center font-bold text-white text-sm md:text-[16px] cursor-pointer shadow-md flex items-center justify-center gap-1"
//           >
//             <span>Panduan</span>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </motion.a>
          
//           <motion.a
//             whileHover={{ scale: 1.05, y: 5 }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-gradient-to-r from-[#ff9b29] to-[#ff8c10] hover:from-[#ff8c10] hover:to-[#e67800] px-6 py-2 rounded-2xl text-center text-white font-bold text-sm md:text-[16px] cursor-pointer shadow-md"
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
//               className="text-xl md:text-2xl font-bold text-blue-700"
//             >
//               {stat.value}
//             </motion.div>
//             <div className="text-xs md:text-sm text-gray-500">{stat.label}</div>
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
import { Star, MapPin, ChevronDown, ChevronRight, MapIcon, Calendar, Users } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10" style={{
        backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                          linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }}></div>
      
      {/* Animated Gradients */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 left-10 w-72 h-72 rounded-full opacity-40 dark:opacity-20 blur-3xl" 
        style={{
          background: 'radial-gradient(circle, rgba(172, 23, 84, 1) 0%, rgba(255,255,255,0) 70%)',
        }}
      ></motion.div>
      
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-10 w-72 h-72 rounded-full opacity-40 dark:opacity-20 blur-3xl" 
        style={{
          background: 'radial-gradient(circle, rgba(23, 84, 172, 1) 0%, rgba(255,255,255,0) 70%)',
        }}
      ></motion.div>
      
      {/* Additional Gradient Decorations */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full opacity-30 dark:opacity-15 blur-3xl" 
        style={{
          background: 'radial-gradient(circle, rgba(255, 153, 0, 1) 0%, rgba(255,255,255,0) 70%)',
        }}
      ></motion.div>
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full opacity-30 dark:opacity-15 blur-3xl" 
        style={{
          background: 'radial-gradient(circle, rgba(76, 211, 136, 1) 0%, rgba(255,255,255,0) 70%)',
        }}
      ></motion.div>
      
      {/* Decorative Elements */}
      <motion.div 
        animate={floatAnimation}
        className="absolute top-20 right-[15%] hidden md:block">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
      </motion.div>
      
      <motion.div 
        animate={floatAnimation}
        transition={{ delay: 1 }}
        className="absolute bottom-40 left-[15%] hidden md:block">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
          <MapPin className="w-6 h-6 text-blue-500" />
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
        className="z-10 mt-[100px] w-full max-w-4xl px-4"
      >
        <motion.div variants={fadeIn} className="flex justify-center mb-2">
          <div className="bg-blue-100/50 dark:bg-blue-900/30 px-4 py-1 rounded-full backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">BPS Republik Indonesia</span>
          </div>
        </motion.div>
        
        <motion.h1 
          variants={fadeIn}
          className={`md:max-w-[700px] mx-auto px-5 ${merriweatherSans.className} text-xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold text-[#1E40AF] dark:text-blue-300 md:leading-[3rem] lg:leading-[3.5rem]`}
        >
          Asisten AI untuk Survei Digital Wisatawan Nusantara!
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className={`my-4 px-4 text-sm sm:text-base text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto`}
        >
          Permudah wawancara, otomatisasi survei, dan nikmati interaksi yang personal dengan platform AI
          yang dirancang khusus untuk kebutuhan Wisatawan Nusantara.
        </motion.p>
        
        <motion.div 
          variants={fadeIn}
          className="flex justify-center gap-4 my-4"
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
      
      {/* Feature Cards above Hero */}
      <motion.div 
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={staggerContainer}
        className="z-10 flex flex-wrap justify-center gap-4 px-4 mb-8"
      >
        {[
          { icon: <MapIcon className="w-5 h-5 text-rose-500" />, title: "Destinasi Populer", desc: "Informasi terbaru" },
          { icon: <Calendar className="w-5 h-5 text-green-500" />, title: "Survei Terjadwal", desc: "Pengumpulan data efisien" },
          { icon: <Users className="w-5 h-5 text-amber-500" />, title: "Analisis Pengunjung", desc: "Pola kunjungan wisata" },
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            variants={fadeIn}
            whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-md w-full max-w-[180px]"
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
      
      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='z-10 relative'
      >
        <div className="absolute -top-4 left-[20%] hidden md:block">
          <motion.div 
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg shadow-lg"
          >
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">250+ Destinasi</span>
          </motion.div>
        </div>
        
        <div className="absolute -top-2 right-[25%] hidden md:block">
          <motion.div 
            animate={{
              y: [0, -8, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="bg-rose-50 dark:bg-rose-900/40 p-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-rose-700 dark:text-rose-300">Akurat</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-rose-500 dark:text-rose-400" fill="#e11d48" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <Image
          src="/hero_pict.svg"
          alt="Hero Picture"
          width={900}
          height={900}
          className="mt-2 w-full max-w-[900px] h-auto rounded-lg dark:brightness-90 dark:contrast-125"
        />
        
        {/* Decorative Circles */}
        <div className="absolute -z-10 -top-8 -left-8 w-20 h-20 rounded-full border-4 border-dashed border-blue-100 dark:border-blue-900 opacity-60"></div>
        <div className="absolute -z-10 -bottom-10 -right-5 w-16 h-16 rounded-full border-4 border-dashed border-rose-100 dark:border-rose-900 opacity-60"></div>
        
        {/* Call to action buttons with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute -bottom-[120px] md:bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col bg-[#ac175575] dark:bg-[#ac175545] backdrop-blur-md w-40 md:w-48 p-3 rounded-3xl gap-2 shadow-lg border border-white/30 dark:border-white/10"
        >
          <motion.a
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#41bf28] to-[#34a71f] hover:from-[#34a71f] hover:to-[#2d8f1b] dark:from-[#36a622] dark:to-[#2d8f1b] px-6 py-2 rounded-2xl text-center font-bold text-white text-sm md:text-[16px] cursor-pointer shadow-md flex items-center justify-center gap-1"
          >
            <span>Panduan</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L17 7M17 7H8M17 7V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.05, y: 5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#ff9b29] to-[#ff8c10] hover:from-[#ff8c10] hover:to-[#e67800] dark:from-[#e67800] dark:to-[#cc6a00] px-6 py-2 rounded-2xl text-center text-white font-bold text-sm md:text-[16px] cursor-pointer shadow-md"
          >
            Mulai Survei
          </motion.a>
        </motion.div>
      </motion.div>
      
      {/* Statistics Counters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="z-10 w-full max-w-4xl flex justify-center gap-8 mt-[150px] md:mt-[50px] mb-12 px-4"
      >
        {[
          { value: "25,000+", label: "Responden" },
          { value: "34+", label: "Provinsi" },
          { value: "98%", label: "Akurasi" }
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
    </div>
  );
}