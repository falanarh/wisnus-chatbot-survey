// src/components/SurveyCompletionPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { calculateDurationInMinutes, formatDate, formatDuration } from '@/utils/dateUtils';
import { SurveySessionStatus } from '@/services/surveyService';

interface SurveyCompletionPageProps {
    sessionData?: SurveySessionStatus;
}

const SurveyCompletionPage: React.FC<SurveyCompletionPageProps> = ({ sessionData }) => {

    // Format the completion date if available
    const completionDate = sessionData ? formatDate(new Date(sessionData.updated_at)) : "N/A";

    const surveyDuration = sessionData
        ? calculateDurationInMinutes(new Date(sessionData.started_at), new Date(sessionData.updated_at))
        : "N/A";

    // Get survey duration if available
    const surveyDurationStr = typeof surveyDuration === 'number' ? formatDuration(surveyDuration) : "N/A";

    return (
        <div className="min-h-screen relative">
            {/* Background Layer */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {/* Base Background Color */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />
                
                {/* Grid Background */}
                <div 
                    className="absolute inset-0 opacity-30 dark:opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                                        linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Subtle Dots Pattern */}
                <div 
                    className="absolute inset-0 opacity-10 dark:opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Colored Blobs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            {/* Content Container */}
            <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center" style={{ zIndex: 1 }}>
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2
                    }}
                    className="mb-8 relative"
                >
                    <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="absolute -top-2 -right-2 bg-blue-500 dark:bg-blue-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    >
                        BPS
                    </motion.div>
                </motion.div>

                {/* Header Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                        Survei Selesai!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                        Terima kasih telah berpartisipasi dalam Survei Digital Wisatawan Nusantara 2025.
                    </p>
                </motion.div>

                {/* Survey Completion Certificate/Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="my-6 max-w-md w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/70 shadow-lg"
                >
                    <div className="bg-blue-500 dark:bg-blue-800 p-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <Award className="w-5 h-5 text-white mr-2" />
                            <span className="text-white font-medium">Tanggal Pengisian</span>
                        </div>
                        <div className="text-white/80 text-sm">{completionDate}</div>
                    </div>
                    <div className="p-4 bg-white/90 dark:bg-gray-800/90 flex flex-col items-center">
                        <Image
                            src="/bps_logo.png"
                            alt="Badan Pusat Statistik"
                            width={80}
                            height={80}
                            className="dark:hidden mb-3"
                        />
                        <Image
                            src="/bps_dark.png"
                            alt="Badan Pusat Statistik"
                            width={80}
                            height={80}
                            className="hidden dark:block mb-3"
                        />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Survei Digital Wisatawan Nusantara</h3>
                        <div className="flex justify-between w-full mt-4 text-sm">
                            <div className="flex flex-col justify-center w-1/2">
                                <div className="text-gray-500 dark:text-gray-400">Waktu Penyelesaian</div>
                                <div className="font-semibold text-gray-800 dark:text-white">{surveyDurationStr}</div>
                            </div>
                            <div className='w-[0.5%] bg-gray-200 dark:bg-gray-700'></div>
                            <div className='flex flex-col justify-center w-1/2'>
                                <div className="text-gray-500 dark:text-gray-400">Status</div>
                                <div className="font-semibold text-green-600 dark:text-green-400">Selesai</div>
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-2 gap-4 w-full mt-4 text-sm">
                            <div className="border-r border-gray-200 dark:border-gray-700">
                                <div className="text-gray-500 dark:text-gray-400">Waktu Penyelesaian</div>
                                <div className="font-semibold text-gray-800 dark:text-white">{surveyDurationStr}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400">Status</div>
                                <div className="font-semibold text-green-600 dark:text-green-400">Selesai</div>
                            </div>
                        </div> */}
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex flex-col gap-4 mt-4 w-full max-w-md"
                >
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl
                                bg-gradient-to-r from-blue-500 dark:from-blue-800 to-indigo-600 dark:to-indigo-800 text-white
                                hover:from-blue-600 hover:to-indigo-700 transition-all
                                font-medium shadow-md hover:shadow-lg"
                    >
                        <span>Kembali ke Beranda</span>
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default SurveyCompletionPage;