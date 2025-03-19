"use client";

import ProtectedRoute from "@/components/other/ProtectedRoute";
import EvaluationPage from "@/components/survey/evaluation/EvaluationPage";

export default function SurveyEvaluationPage() {
    return (
        <ProtectedRoute>
            <EvaluationPage />
        </ProtectedRoute>
    );
}