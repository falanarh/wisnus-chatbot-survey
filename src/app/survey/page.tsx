"use client";

import React from "react";
import SurveyChatbot from "@/components/survey/SurveyChatbot";
import ProtectedRoute from "@/components/other/ProtectedRoute";


const SurveyChatbotPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <SurveyChatbot />
    </ProtectedRoute>
  );
};

export default SurveyChatbotPage;