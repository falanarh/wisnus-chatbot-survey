"use client";

import React from "react";
import ChatLayout from "@/components/ChatLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Catatan: Tidak perlu export metadata di sini karena ini adalah 'use client' component
// Pindahkan metadata ke route.tsx atau layout.tsx jika diperlukan

const SurveyChatbot: React.FC = () => {
  return (
    <ProtectedRoute>
      <ChatLayout />
    </ProtectedRoute>
  );
};

export default SurveyChatbot;