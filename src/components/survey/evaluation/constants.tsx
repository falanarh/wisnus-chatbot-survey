import { EvaluationQuestion } from "@/services/survey/evaluation";
import { ThumbsUp, Award, Star, Brain, Shield, MessageCircle } from "lucide-react";

export const evaluationQuestions: EvaluationQuestion[] = [
  {
    id: "ease_of_use",
    text: "Apakah Anda merasa mudah menjawab pertanyaan dalam kuesioner ini?",
    scaleType: "agreement",
    min: 1,
    max: 7,
    minLabel: "Sangat tidak setuju",
    maxLabel: "Sangat setuju",
    icon: <ThumbsUp size={24} className="text-blue-500" />,
    description: "Evaluasi kemudahan penggunaan dari kuesioner percakapan ini"
  },
  {
    id: "participation_ease",
    text: "Apakah kuesioner ini membantu Anda berpartisipasi dalam survei dengan lebih mudah?",
    scaleType: "agreement",
    min: 1,
    max: 7,
    minLabel: "Sangat tidak setuju",
    maxLabel: "Sangat setuju",
    icon: <Award size={24} className="text-indigo-500" />,
    description: "Nilai tingkat kemudahan partisipasi dalam format survei seperti ini"
  },
  {
    id: "enjoyment",
    text: "Apakah Anda merasa nyaman dan menikmati saat mengisi kuesioner ini?",
    scaleType: "agreement",
    min: 1,
    max: 7,
    minLabel: "Sangat tidak setuju",
    maxLabel: "Sangat setuju",
    icon: <Star size={24} className="text-yellow-500" />,
    description: "Evaluasi pengalaman dan kesenangan menggunakan survei percakapan"
  },
  {
    id: "data_security",
    text: "Apakah informasi pribadi Anda dikelola dengan aman dalam kuesioner ini?",
    scaleType: "agreement",
    min: 1,
    max: 7,
    minLabel: "Sangat tidak setuju",
    maxLabel: "Sangat setuju",
    icon: <Shield size={24} className="text-green-500" />,
    description: "Nilai tingkat kepercayaan terhadap keamanan informasi pribadi"
  },
  {
    id: "privacy_safety",
    text: "Apakah menurut Anda kuesioner ini cukup aman untuk melindungi informasi pribadi Anda?",
    scaleType: "agreement",
    min: 1,
    max: 7,
    minLabel: "Sangat tidak setuju",
    maxLabel: "Sangat setuju",
    icon: <Shield size={24} className="text-green-500" />,
    description: "Evaluasi persepsi keamanan privasi dalam format kuesioner ini"
  },
  {
    id: "mental_effort",
    text: "Seberapa besar usaha yang Anda butuhkan untuk menyelesaikan kuesioner ini?",
    scaleType: "effort",
    min: 1,
    max: 9,
    minLabel: "Sangat rendah",
    maxLabel: "Sangat tinggi",
    icon: <Brain size={24} className="text-purple-500" />,
    description: "Evaluasi tingkat usaha mental yang diperlukan untuk menyelesaikan survei"
  },
  {
    id: "overall_experience",
    text: "Ceritakan pengalaman Anda menggunakan kuesioner ini. Apa yang Anda sukai atau tidak sukai?",
    scaleType: "text",
    min: 10,
    max: 1000,
    minLabel: "",
    maxLabel: "",
    icon: <MessageCircle size={24} className="text-teal-500" />,
    description: "Berikan umpan balik mendalam tentang pengalaman survei Anda"
  }
];