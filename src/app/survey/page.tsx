"use client";

import React from "react";
// import ChatLayout from "@/components/ChatLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import SurveyChatbot from "@/components/SurveyChatbot";

// Catatan: Tidak perlu export metadata di sini karena ini adalah 'use client' component
// Pindahkan metadata ke route.tsx atau layout.tsx jika diperlukan

const SurveyChatbotPage: React.FC = () => {
  return (
    <ProtectedRoute>
      {/* <ChatLayout /> */}
      <SurveyChatbot />
    </ProtectedRoute>
  );
};

export default SurveyChatbotPage;