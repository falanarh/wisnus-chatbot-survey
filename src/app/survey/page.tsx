"use client";

import React from "react";
import ProtectedRoute from "@/components/other/ProtectedRoute";
import SurveyChatbot from "@/components/survey/SurveyChatbot";


const SurveyChatbotPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <SurveyChatbot />
    </ProtectedRoute>
  );
};

export default SurveyChatbotPage;