import React from "react";

interface PreSurveyInfoPopupProps {
  open: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const PreSurveyInfoPopup: React.FC<PreSurveyInfoPopupProps> = ({ open, onContinue, onBack }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background layer: gradient, grid, dots, blobs */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-300" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        {/* Dots */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        {/* Colored Blobs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>
      {/* Popup Card */}
      <div className="relative bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-0 max-w-md w-full m-4 overflow-hidden border-2 border-blue-600 animate-popup">
        {/* Top Bar Accent */}
        <div className="h-2 w-full bg-blue-600 dark:bg-blue-500 animate-gradient-x" />
        {/* Icon/Illustration */}
        <div className="flex flex-col items-center pt-8 pb-2 px-8">
          <div className="mb-4 animate-bounce-slow">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#2563eb" fillOpacity="0.10" />
              <path d="M32 18v20" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              <circle cx="32" cy="46" r="2.5" fill="#f59e42" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-3 text-center text-gray-900 dark:text-white drop-shadow-lg">Sebelum Memulai Survei</h2>
          <div className="mb-6 text-gray-700 dark:text-gray-200 text-center text-lg leading-relaxed space-y-3">
            <div>
              <span className="font-semibold text-blue-700 dark:text-blue-400">Mohon luangkan waktu 30-45 menit</span> untuk mengisi survei ini hingga selesai.
            </div>
            <div className="flex items-center justify-center gap-2 text-base">
              {/* <span className="text-yellow-500 text-xl">⏳</span> */}
              <span className="italic text-yellow-800 dark:text-yellow-300">Dimohon tidak meninggalkan survei sebelum selesai.</span>
            </div>
            <div className="mt-2 text-base text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-green-700 dark:text-green-400">Terima kasih atas partisipasi Anda.</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-8 pb-8">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Kembali
          </button>
          <button
            onClick={onContinue}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition-all duration-200 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            autoFocus
          >
            Lanjut
          </button>
        </div>
        {/* Subtle floating animation */}
        <style jsx>{`
          .animate-popup { animation: popupIn 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
          @keyframes popupIn { 0% { transform: scale(0.85) translateY(40px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
          .animate-bounce-slow { animation: bounceSlow 2.5s infinite alternate; }
          @keyframes bounceSlow { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
          .animate-gradient-x { background-size: 200% 100%; animation: gradientX 3s linear infinite; }
          @keyframes gradientX { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        `}</style>
      </div>
    </div>
  );
};

export default PreSurveyInfoPopup; 