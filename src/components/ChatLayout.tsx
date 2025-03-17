"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Send, Bot, Loader2, Square, ArrowDown, Trash2 } from "lucide-react";
import Image from "next/image";
import { Merriweather_Sans } from "next/font/google";
import ModeToggle from "./ModeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { useChatPersistence } from "@/utils/chatPersistence";
import MenuToggle from "./MenuToggle";
import { ThemeToggle } from "./ThemeToggle";
import { analyzeIntent, queryRAG, startSurvey, submitSurveyResponse } from "@/services/surveyService";
import { getAuthToken, getUserData, updateUserDataProperty } from "@/services/authService";
import { generateUnorderedList } from "@/utils/otherUtils";

const merriweatherSans = Merriweather_Sans({
    variable: "--font-merriweather-sans",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const ChatLayout = () => {
    // Gunakan custom hook untuk persistensi chat
    const { messages, addMessage, updateLastMessage, clearChat } = useChatPersistence();

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<'survey' | 'qa'>('survey');
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // State untuk kontrol scroll
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Referensi untuk menandai bahwa user yang melakukan scroll, bukan auto-scroll
    const isUserScrollingRef = useRef(false);

    // Referensi untuk timeout token generation
    const tokenGenerationRef = useRef<{
        timeouts: NodeJS.Timeout[];
        stopped: boolean;
    }>({
        timeouts: [],
        stopped: false
    });

    // Function untuk scroll ke bawah
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    // Effect untuk auto-scroll hanya saat messages berubah dan user belum scroll manual
    useEffect(() => {
        // Auto-scroll hanya jika user belum scroll manual
        if (!userHasScrolled && !isUserScrollingRef.current) {
            scrollToBottom();
        }
    }, [messages, userHasScrolled]);

    // Function untuk mendeteksi scroll user
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
            // Tandai bahwa user sedang scroll
            isUserScrollingRef.current = true;

            // Set user telah scroll
            setUserHasScrolled(true);

            // Hitung posisi scroll
            const { scrollTop, scrollHeight, clientHeight } = chatContainer;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // Jika user scroll ke dekat bawah (kurang dari 20px), reset userHasScrolled
            if (distanceFromBottom < 20) {
                setUserHasScrolled(false);
            }

            // Tampilkan tombol scroll jika tidak di dekat bawah
            setShowScrollButton(distanceFromBottom > 100);

            // Reset flag setelah user selesai scroll
            setTimeout(() => {
                isUserScrollingRef.current = false;
            }, 100);
        };

        chatContainer.addEventListener("scroll", handleScroll);

        return () => {
            chatContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Handle klik tombol scroll ke bawah
    const handleScrollToBottom = () => {
        scrollToBottom();
        setUserHasScrolled(false);
        setShowScrollButton(false);
    };

    // Function to stop token generation
    const stopTokenGeneration = () => {
        // Clear all scheduled token generation timeouts
        tokenGenerationRef.current.timeouts.forEach(timeout => clearTimeout(timeout));
        tokenGenerationRef.current.stopped = true;

        // Update the last bot message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && !lastMessage.user) {
            updateLastMessage(lastMessage.text + " [berhenti mengetik]", false);
        }

        setBotIsTyping(false);
    };

    const handleSend = async () => {
        // Jangan izinkan pengiriman pesan jika input kosong atau bot sedang mengetik
        if (!input.trim() || loading || botIsTyping) return;

        const userMessage = input.trim();
        setInput("");
        addMessage({ text: userMessage, user: true });
        setLoading(true);
        setBotIsTyping(true);

        // Reset stopped state for new message
        tokenGenerationRef.current.stopped = false;
        tokenGenerationRef.current.timeouts = [];

        // Saat user mengirim pesan baru, reset state scroll
        setUserHasScrolled(false);

        try {
            // Tambahkan pesan loading dari bot
            addMessage({ text: "", user: false, loading: true });

            if (mode === 'survey') {
                const userData = getUserData();
                if (!userData?.activeSurveySessionId) {
                    throw new Error("Active survey session ID not found in user data");
                }
                const token = getAuthToken();
                if (!token) {
                    throw new Error("Token not found");
                }
                // Cek apakah user sedang dalam sesi survei
                if (!userData.activeSurveySessionId) {
                    // Analisis intent pengguna
                    const intentAnalysis = await analyzeIntent(token, userMessage);
                    if (!intentAnalysis.success || !intentAnalysis.data) {
                        throw new Error("Failed to analyze intent");
                    }
                    // Cek apakah pengguna ingin memulai survei
                    if (intentAnalysis.data.wants_to_start) {
                        const surveyStartResponse = await startSurvey(token);
                        if (!surveyStartResponse.success) {
                            throw new Error("Failed to start survey");
                        }
                        updateUserDataProperty('activeSurveySessionId', surveyStartResponse.session_id);
                        if (surveyStartResponse.next_question) {
                            simulateTyping(surveyStartResponse.next_question.text);
                        } else {
                            simulateTyping("Pertanyaan berikutnya tidak tersedia.");
                        }

                    } else {
                        const text = "Tidak masalah jika Anda belum siap untuk memulai survei. Silakan kirim pesan kapan saja jika Anda ingin memulai.";
                        simulateTyping(text);
                    }
                } else {
                    const surveyResponse = await submitSurveyResponse(token, userData.activeSurveySessionId, userMessage);
                    if (surveyResponse.success) {
                        let text = "";
                        if (surveyResponse.info === "survey_completed" && surveyResponse.additional_info) {
                            text = surveyResponse.additional_info;
                        } else if (surveyResponse.info === "expected_answer" && surveyResponse.next_question) {
                            if (surveyResponse.next_question.code === "KR004") {
                                text = `${surveyResponse.next_question.text}\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(surveyResponse.next_question.options || [], "◆")}`;
                            } else {
                                text = surveyResponse.next_question.text;
                            }
                        } else if (surveyResponse.info === "unexpected_answer_or_other" && surveyResponse.currentQuestion && surveyResponse.clarification_reason && surveyResponse.follow_up_question) {
                            if (surveyResponse.currentQuestion.code === "KR004") {
                                text = `${surveyResponse.clarification_reason} ${surveyResponse.follow_up_question}\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(surveyResponse.currentQuestion.options || [], "◆")}`;
                            } else {
                                text = `${surveyResponse.clarification_reason} ${surveyResponse.follow_up_question}`;
                            }
                        } else if (surveyResponse.info === "question" && surveyResponse.currentQuestion && surveyResponse.answer) {
                            if (surveyResponse.currentQuestion.code === "KR004") {
                                text = `${surveyResponse.answer} \n\nPertanyaan saat ini: ${surveyResponse.currentQuestion.text}\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(surveyResponse.currentQuestion.options || [], "◆")}`;
                            } else {
                                text = `${surveyResponse.answer} \n\nPertanyaan saat ini: ${surveyResponse.currentQuestion.text}`;
                            }
                        } else if (surveyResponse.info === "error" && surveyResponse.additional_info) {
                            text = surveyResponse.additional_info;
                        }
                        simulateTyping(text);
                    } else {
                        simulateTyping("Terjadi kesalahan saat mengirim jawaban survei Anda.");
                    }
                }
            } else {
                const ragResponse = await queryRAG(userMessage);
                simulateTyping(ragResponse.answer);
            }
        } catch (error) {
            console.error("Error processing message:", error);
            // Tanggapi dengan pesan error jika terjadi kesalahan
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mensimulasikan pengetikan respons
    const simulateTyping = (response: string) => {
        const tokens = response.split(" ");
        let currentText = "";

        tokens.forEach((token, index) => {
            const timeout = setTimeout(() => {
                // Skip if generation has been stopped
                if (tokenGenerationRef.current.stopped) return;

                currentText += (index === 0 ? "" : " ") + token;
                updateLastMessage(currentText, false);

                // Setelah token terakhir, izinkan pengguna mengirim pesan lagi
                if (index === tokens.length - 1) {
                    setBotIsTyping(false);
                }
            }, index * 100);

            // Store timeout reference for potential cancellation
            tokenGenerationRef.current.timeouts.push(timeout);
        });
    };

    // Function to close all dropdowns
    const closeAllDropdowns = () => {
        setMenuOpen(false);
        setThemeMenuOpen(false);
    };

    // Function to close other dropdowns when opening the menu
    const closeOtherDropdownsExceptMenu = () => {
        setThemeMenuOpen(false);
    };

    // Function to close other dropdowns when opening the theme menu
    const closeOtherDropdownsExceptTheme = () => {
        setMenuOpen(false);
    };

    // Menentukan apakah tombol kirim dinonaktifkan
    const isSendButtonDisabled = loading || botIsTyping || !input.trim();

    // Menambahkan menu item baru untuk reset chat
    const extraMenuItems = [
        {
            name: "Hapus Percakapan",
            icon: <Trash2 className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />,
            onClick: () => {
                clearChat();
                setMenuOpen(false);
            }
        }
    ];

    return (
        <div className={`flex flex-col min-h-screen relative
            ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'}`}>

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Header */}
            <div className={`sticky top-0 z-30 w-full ${isDarkMode
                ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80'
                : 'bg-gradient-to-r from-blue-400/80 to-indigo-400/80'} 
                backdrop-blur-md text-white p-4 shadow-md`}>
                <div className="max-w-6xl mx-auto flex items-start justify-between">
                    <div onClick={() => window.location.href = '/'} className="flex items-center gap-2 w-full sm:w-[300px] cursor-pointer">
                        <Image
                            src={isDarkMode ? "/bps_dark.png" : "/bps_logo.png"}
                            alt="Badan Pusat Statistik"
                            width={isDarkMode ? 42 : 48}
                            height={isDarkMode ? 42 : 48}
                        />
                        <h1 className={`hidden md:block text-[12px] md:text-lg ${merriweatherSans.className} font-bold text-white`}>
                            Badan Pusat Statistik
                        </h1>
                        <h2 className="block sm:hidden text-[14px] font-bold">
                            {mode === 'survey' ? 'Survei Digital Wisatawan Nusantara' : 'Tanya Jawab Survei Wisnus'}
                        </h2>
                    </div>

                    {/* Chat Type Title */}
                    <div className="hidden sm:block w-[600px] mx-auto px-2">
                        <h2 className="hidden sm:block text-[12px] sm:text-[18px] md:text-xl font-bold text-center">
                            {mode === 'survey' ? 'Survei Digital Wisatawan Nusantara' : 'Tanya Jawab Survei Wisnus'}
                        </h2>
                        <p className={`hidden md:block text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-100'} text-center`}>
                            {mode === 'survey' ? 'Berbagi pengalaman perjalanan Anda' : 'Informasi statistik BPS'}
                        </p>
                    </div>

                    <div className="sm:w-[300px] flex items-center justify-end gap-2">
                        {/* Komponen ThemeToggle terpisah */}
                        <ThemeToggle
                            isOpen={themeMenuOpen}
                            setIsOpen={setThemeMenuOpen}
                            closeOtherDropdowns={closeOtherDropdownsExceptTheme}
                        />

                        {/* Komponen MenuToggle terpisah */}
                        <MenuToggle
                            isDarkMode={isDarkMode}
                            isOpen={menuOpen}
                            setIsOpen={setMenuOpen}
                            closeOtherDropdowns={closeOtherDropdownsExceptMenu}
                            extraMenuItems={extraMenuItems}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative justify-center">
                <div
                    ref={chatContainerRef}
                    className={`w-full mx-auto overflow-y-auto ${messages.length === 0 ? 'h-[87vh]' : 'h-[calc(100vh-210px)]'} flex justify-center`}
                >
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-2 px-3 mb-[180px]">
                            <div className={`${isDarkMode
                                ? 'bg-blue-900/30'
                                : 'bg-blue-50/50'} 
                                p-3 rounded-full backdrop-blur-sm border ${isDarkMode ? 'border-blue-800/30' : 'border-blue-100/30'}`}>
                                <Bot className={`w-8 h-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {mode === 'survey'
                                    ? 'Selamat datang di Survei Digital Wisatawan Nusantara'
                                    : 'Selamat datang di Layanan Tanya Jawab Survei Wisnus'}
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Silakan kirim pesan untuk memulai percakapan
                            </p>
                        </div>
                    )}
                    {messages.length > 0 && (
                        <AnimatePresence>
                            <div className="max-w-4xl w-full px-4 pb-[180px]">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-start gap-3 my-4 ${msg.user ? "justify-end" : "justify-start"}`}
                                    >
                                        {!msg.user && (
                                            <div className={`flex-shrink-0 
                                        ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100/70'} 
                                        rounded-full p-2 backdrop-blur-sm border 
                                        ${isDarkMode ? 'border-blue-800/40' : 'border-blue-200/40'}`}>
                                                <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[75%] p-4 rounded-2xl shadow-lg text-sm break-words whitespace-pre-wrap overflow-hidden backdrop-blur-sm
                                        ${msg.user
                                                    ? isDarkMode
                                                        ? "bg-indigo-600/50 border border-indigo-500/40 text-white rounded-tr-none"
                                                        : "bg-gradient-to-br from-blue-500/80 to-blue-600/80 border border-blue-400/30 text-white rounded-tr-none"
                                                    : isDarkMode
                                                        ? "bg-gray-800/40 border border-gray-700/40 text-white rounded-tl-none"
                                                        : "bg-white/60 border border-white/50 text-gray-700 rounded-tl-none"
                                                }`}
                                        >
                                            {msg.loading ? (
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`} />
                                                </div>
                                            ) : (
                                                <p className="break-words whitespace-pre-wrap text-justify">{msg.text}</p>
                                            )}
                                        </div>

                                        {msg.user && (
                                            <div className={`flex-shrink-0 
                                        ${isDarkMode ? 'bg-indigo-600/60' : 'bg-blue-500/80'} 
                                        rounded-full p-2 backdrop-blur-sm border 
                                        ${isDarkMode ? 'border-indigo-500/40' : 'border-blue-400/40'}`}>
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {/* This empty div is the target for scrolling */}
                                <div ref={messagesEndRef} className="h-1" />
                            </div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Tombol scroll ke bawah */}
                <AnimatePresence>
                    {showScrollButton && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleScrollToBottom}
                            className={`fixed bottom-40 right-8 z-40 p-4 rounded-full shadow-lg
                                ${isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40'
                                    : 'bg-blue-500 hover:bg-blue-400 text-white border border-blue-400/40'} 
                                backdrop-blur-sm transition-all duration-300`}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Input Area */}
            <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6">
                <div className="max-w-4xl mx-auto flex flex-col gap-3">
                    {/* Mode Toggle */}
                    <div className="flex items-center justify-center">
                        <ModeToggle mode={mode} setMode={setMode} isDarkMode={isDarkMode} />
                    </div>

                    {/* Input Field */}
                    <div className={`flex items-center gap-2 
                        ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/70'} 
                        rounded-full pl-5 pr-2 py-3 border 
                        ${isDarkMode ? 'border-gray-700/40' : 'border-white/60'} 
                        focus-within:${isDarkMode ? 'border-blue-500/50' : 'border-blue-300'} 
                        focus-within:ring-2 focus-within:${isDarkMode ? 'ring-blue-500/20' : 'ring-blue-100'} 
                        backdrop-blur-md shadow-lg transition-all
                        ${botIsTyping ? 'opacity-80' : 'opacity-100'}`}
                        onClick={closeAllDropdowns}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={botIsTyping ? "Tunggu chatbot membalas..." : mode === 'survey' ? "Ketik jawaban survei Anda..." : "Ketik pertanyaan Anda..."}
                            className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-400'}`}
                            disabled={botIsTyping} // Nonaktifkan input saat bot sedang mengetik
                        />

                        {/* Tombol Stop saat bot mengetik */}
                        {botIsTyping ? (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={stopTokenGeneration}
                                className={`p-3 rounded-full backdrop-blur-sm mr-2
                                    ${isDarkMode
                                        ? 'bg-red-600/70 text-white border border-red-500/40 hover:bg-red-500/80'
                                        : 'bg-red-500/80 text-white border border-red-400/40 hover:bg-red-400/90'}`}
                                aria-label="Stop Generation"
                            >
                                <Square className="w-5 h-5" />
                            </motion.button>
                        ) :
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={!isSendButtonDisabled ? { scale: 1.1, rotate: 10 } : {}}
                                onClick={handleSend}
                                disabled={isSendButtonDisabled}
                                className={`p-3 rounded-full backdrop-blur-sm ${!isSendButtonDisabled
                                    ? isDarkMode
                                        ? 'bg-blue-600/80 text-white border border-blue-500/40'
                                        : 'bg-blue-500/90 text-white border border-blue-400/40'
                                    : isDarkMode
                                        ? 'bg-gray-700/60 text-gray-400 border border-gray-600/30'
                                        : 'bg-gray-200/80 text-gray-400 border border-gray-300/30'
                                    } transition-colors duration-200 ${!isSendButtonDisabled ? 'hover:bg-[#3b82f6cc] hover:text-white' : ''}`}
                            >
                                <Send className="w-5 h-5" />
                            </motion.button>
                        }
                    </div>

                    {/* Status indikator */}
                    {botIsTyping && (
                        <div className="text-center mt-1">
                            <p className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} animate-pulse`}>
                                Chatbot sedang mengetik...
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-1">
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            © 2025 Badan Pusat Statistik Republik Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;