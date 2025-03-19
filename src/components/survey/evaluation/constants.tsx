import { ThumbsUp, Award, Star, Brain, Shield } from "lucide-react";
import { EvaluationQuestion } from "./QuestionCard";


export const evaluationQuestions: EvaluationQuestion[] = [
  {
    id: "ease_of_use",
    text: "Apakah mudah untuk menjawab pertanyaan dalam kuesioner percakapan?",
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
    text: "Kuesioner percakapan akan sangat memudahkan partisipasi saya dalam survei.",
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
    text: "Apakah menyenangkan bagi saya untuk mengisi pertanyaan dalam kuesioner percakapan?",
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
    text: "Informasi pribadi saya dikelola dengan aman dalam kuesioner percakapan ini.",
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
    text: "Apakah kuesioner percakapan ini aman untuk informasi pribadi saya?",
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
    text: "Seberapa banyak usaha mental yang Anda alokasikan untuk menyelesaikan kuesioner percakapan ini?",
    scaleType: "effort",
    min: 1,
    max: 9,
    minLabel: "Sangat rendah",
    maxLabel: "Sangat tinggi",
    icon: <Brain size={24} className="text-purple-500" />,
    description: "Evaluasi tingkat usaha mental yang diperlukan untuk menyelesaikan survei"
  },
];