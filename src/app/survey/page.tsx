//app/survey/page.tsx

// import React from "react";
// import { Metadata } from "next";
// import { Lora, Mulish, Merriweather_Sans } from "next/font/google";
// import ChatLayout from "@/components/ChatLayout";

// export const metadata: Metadata = {
//   title: "Survei Wisatawan Nusantara 2025",
// };

// const mulish = Mulish({
//   variable: "--font-mulish",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

// const merriweatherSans = Merriweather_Sans({
//   variable: "--font-merriweather-sans",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

// const lora = Lora({
//   variable: "--font-lora",
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

// const SurveyChatbot: React.FC = () => {
//   return (
//       <ChatLayout />
//   );
// };

// export default SurveyChatbot;


"use client";

import React from "react";
import { Lora, Mulish, Merriweather_Sans } from "next/font/google";
import ChatLayout from "@/components/ChatLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Catatan: Tidak perlu export metadata di sini karena ini adalah 'use client' component
// Pindahkan metadata ke route.tsx atau layout.tsx jika diperlukan

const SurveyChatbot: React.FC = () => {
  return (
    <ChatLayout />
  );
};

export default SurveyChatbot;