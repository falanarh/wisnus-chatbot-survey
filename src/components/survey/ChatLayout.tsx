"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/other/ThemeProvider";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatScrollButton from "./ChatScrollButton";
import ChatInputArea from "./ChatInputArea";
import ChatMessageArea from "./ChatMessageArea";
import ModeConfirmationPopup from "./ModeConfirmationPopup";
import { queryRAG } from "@/services/survey/ragService";
import { getToken, getUserData, updateUserProperty, UserData } from "@/services/auth";
import { submitResponse } from "@/services/survey/surveyManagement";
import { Question, SurveyMessageRequest } from "@/services/survey/types";
import { addSurveyMessage } from "@/services/survey/surveyMessages";
import { getCurrentQuestion } from "@/services/survey";
import { ChatMessage, formatSurveyResponse } from "@/utils/surveyMessageFormatters";

interface ChatLayoutProps {
    messages: ChatMessage[];
    addMessage: (message: Partial<ChatMessage> & { text: string; user: boolean; mode: "survey" | "qa" }) => void;
    updateLastMessage: (text: string, user: boolean) => void;
    sessionId?: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
    messages,
    addMessage,
    updateLastMessage,
    sessionId: propSessionId
}) => {
    // State
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [mode, setMode] = useState<'survey' | 'qa'>('survey');
    const [sessionId, setSessionId] = useState<string | undefined>(propSessionId);

    // State untuk pertanyaan saat ini
    const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);

    // State untuk animasi opsi
    const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
    const [visibleOptions, setVisibleOptions] = useState<Record<string, string[]>>({});

    // Mode confirmation popup state
    const [showModePopup, setShowModePopup] = useState(false);
    const qaTimerRef = useRef<NodeJS.Timeout | null>(null);
    const qaTimeoutDuration = 10000; // 10 seconds in QA mode before showing popup
    const popupCountdown = 5; // 5 seconds countdown in the popup

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Theme
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Scroll state
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // User scroll reference
    const isUserScrollingRef = useRef(false);

    // Token generation ref for stopping bot typing
    const tokenGenerationRef = useRef<{
        timeouts: NodeJS.Timeout[];
        stopped: boolean;
    }>({
        timeouts: [],
        stopped: false
    });

    // Update sessionId when prop changes
    useEffect(() => {
        if (propSessionId) {
            setSessionId(propSessionId);
        }
    }, [propSessionId]);

    // Handle mode change and set timer for QA mode
    useEffect(() => {
        // Clear any existing timers
        if (qaTimerRef.current) {
            clearTimeout(qaTimerRef.current);
            qaTimerRef.current = null;
        }

        // Set timer if in QA mode
        if (mode === 'qa') {
            qaTimerRef.current = setTimeout(() => {
                setShowModePopup(true);
            }, qaTimeoutDuration);
        } else {
            setShowModePopup(false);
        }

        // Cleanup on unmount
        return () => {
            if (qaTimerRef.current) {
                clearTimeout(qaTimerRef.current);
            }
        };
    }, [mode]);

    // Function to scroll to bottom
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    // Auto-scroll when messages change if user hasn't scrolled
    useEffect(() => {
        if (!userHasScrolled && !isUserScrollingRef.current) {
            scrollToBottom();
        }
    }, [messages, userHasScrolled, visibleOptions]);

    // Handle scroll detection
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
            // Mark that user is scrolling
            isUserScrollingRef.current = true;
            setUserHasScrolled(true);

            // Calculate scroll position
            const { scrollTop, scrollHeight, clientHeight } = chatContainer;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

            // Reset userHasScrolled if near bottom
            if (distanceFromBottom < 20) {
                setUserHasScrolled(false);
            }

            // Show scroll button if not near bottom
            setShowScrollButton(distanceFromBottom > 100);

            // Reset scroll flag after user finishes scrolling
            setTimeout(() => {
                isUserScrollingRef.current = false;
            }, 100);
        };

        chatContainer.addEventListener("scroll", handleScroll);
        return () => {
            chatContainer.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Handle scroll to bottom button click
    const handleScrollToBottom = () => {
        scrollToBottom();
        setUserHasScrolled(false);
        setShowScrollButton(false);
    };

    // Stop token generation
    const stopTokenGeneration = () => {
        // Clear all timeouts
        tokenGenerationRef.current.timeouts.forEach(timeout => clearTimeout(timeout));
        tokenGenerationRef.current.stopped = true;

        // Update last message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && !lastMessage.user) {
            updateLastMessage(lastMessage.text + " [berhenti mengetik]", false);
        }

        setBotIsTyping(false);
    };

    // Fungsi untuk beralih dari mode QA ke mode survei
    const handleSwitchToSurvey = async () => {
        setMode('survey');
        setShowModePopup(false);

        // Membersihkan timer mode QA
        if (qaTimerRef.current) {
            clearTimeout(qaTimerRef.current);
            qaTimerRef.current = null;
        }

        try {
            // Mendapatkan pertanyaan saat ini dari API
            const response = await getCurrentQuestion();

            let pesanTeks = "Mode berubah ke survei. Mari lanjutkan survei Anda.";

            if (response.success && response.data) {
                const { status, current_question, message } = response.data;

                if (status === "COMPLETED") {
                    pesanTeks += message || " Survei telah selesai. Terima kasih atas partisipasi Anda.";
                    addMessage({
                        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                        text: pesanTeks,
                        user: false,
                        mode: 'survey',
                        options: []
                    });
                } else if (current_question) {
                    pesanTeks += `\n\nPertanyaan saat ini: ${current_question.text}`;

                    // Simpan ke state terlebih dahulu
                    setCurrentQuestion(current_question);

                    // Kirim ke database
                    const surveyMessage: SurveyMessageRequest = {
                        user_message: null,
                        system_response: {
                            info: "switched_to_survey",
                            currentQuestion: current_question,
                            additional_info: "Anda telah beralih ke mode survei."
                        },
                        mode: 'survey',
                    };
                    await addSurveyMessage(surveyMessage);

                    // Buat messageId unik
                    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

                    // Tambahkan pesan ke UI
                    addMessage({
                        id: messageId,
                        text: pesanTeks,
                        user: false,
                        mode: 'survey',
                        questionObject: current_question,
                        questionCode: current_question.code,
                        options: [] // Mulai dengan opsi kosong
                    });

                    // Animasi opsi jika pertanyaan memiliki opsi
                    if (current_question.options?.length) {
                        animateOptions(messageId, current_question.options);
                    }
                } else {
                    addMessage({
                        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                        text: pesanTeks + " Mari lanjutkan survei Anda.",
                        user: false,
                        mode: 'survey',
                        options: []
                    });
                }
            } else {
                addMessage({
                    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                    text: pesanTeks + " Mari lanjutkan survei Anda.",
                    user: false,
                    mode: 'survey',
                    options: []
                });
            }
        } catch (error) {
            console.error("Kesalahan saat mendapatkan pertanyaan saat ini:", error);
            addMessage({
                id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                text: "Mode berubah ke survei. Mari lanjutkan survei Anda.",
                user: false,
                mode: 'survey',
                options: []
            });
        }
    };

    // Fungsi untuk menganimasi opsi jawaban
    const animateOptions = (messageId: string, options: string[]) => {
        if (!options || options.length === 0) return;

        // Set message ini sebagai yang sedang dianimasi
        setAnimatingMessageId(messageId);

        // Mulai dengan array opsi kosong
        setVisibleOptions(prev => ({
            ...prev,
            [messageId]: []
        }));

        // Tambahkan opsi satu per satu
        options.forEach((_, index) => {
            const timeout = setTimeout(() => {
                setVisibleOptions(prev => ({
                    ...prev,
                    [messageId]: options.slice(0, index + 1)
                }));

                // Setelah semua opsi ditampilkan, akhiri animasi
                if (index === options.length - 1) {
                    setTimeout(() => {
                        setAnimatingMessageId(null);
                    }, 300);
                }
            }, 300 * (index + 1));

            tokenGenerationRef.current.timeouts.push(timeout);
        });
    };

    // Handle mengirim pesan
    const handleSend = async () => {
        if (!input.trim() || loading || botIsTyping) return;

        const userMessage = input.trim();
        setInput("");

        // Tambahkan pesan pengguna ke daftar pesan
        addMessage({
            id: `user_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            text: userMessage,
            user: true,
            mode: mode,
            options: []
        });

        setLoading(true);
        setBotIsTyping(true);
        setUserHasScrolled(false);

        // Reset token generation state
        tokenGenerationRef.current = {
            stopped: false,
            timeouts: []
        };

        // Tambahkan pesan loading
        const loadingMsgId = `loading_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        addMessage({
            id: loadingMsgId,
            text: "",
            user: false,
            loading: true,
            mode: mode,
            options: []
        });

        try {
            const token = getToken();
            const userData = getUserData();

            if (!token) throw new Error("Authentication token not found");
            if (!userData) throw new Error("User data not found");

            if (mode === 'survey') {
                await handleSurveyMode(userData, userMessage, loadingMsgId);
            } else {
                await handleQaMode(userMessage);

                // Reset QA mode timer pada setiap interaksi
                if (qaTimerRef.current) {
                    clearTimeout(qaTimerRef.current);
                }
                qaTimerRef.current = setTimeout(() => {
                    setShowModePopup(true);
                }, qaTimeoutDuration);
            }
        } catch (error) {
            console.error("Error processing message:", error);
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle mode QA
    const handleQaMode = async (userMessage: string) => {
        try {
            const ragResponse = await queryRAG(userMessage);
            const surveyMessage: SurveyMessageRequest = {
                user_message: userMessage,
                system_response: { answer: ragResponse.answer },
                mode: 'qa'
            };
            await addSurveyMessage(surveyMessage);

            // Update pesan loading dengan hasil respons
            updateLastMessage(ragResponse.answer, false);
            setBotIsTyping(false);
        } catch (error) {
            console.error("Error processing message:", error);
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        }
    };
    
    // Handle mode survei
    const handleSurveyMode = async (userData: UserData, userMessage: string, loadingMsgId: string) => {
        // Gunakan sessionId dari state atau dari userData
        const currentSessionId = sessionId || userData?.activeSurveySessionId || "";

        try {
            // Kirim permintaan ke API unified /api/survey/respond
            const response = await submitResponse(currentSessionId, userMessage);

            // Jika berhasil dan ada session_id baru, perbarui
            if (response.session_id && response.session_id !== currentSessionId) {
                setSessionId(response.session_id);
                updateUserProperty('activeSurveySessionId', response.session_id);
            }

            // Format respons untuk ditampilkan ke user
            const botResponse = formatSurveyResponse(response);

            // Update current question state jika ada
            if (botResponse.questionObject) {
                setCurrentQuestion(botResponse.questionObject);
            }

            // Perlakuan khusus untuk pertanyaan KR004
            if (botResponse.questionObject?.code === "KR004" && botResponse.questionObject?.options?.length) {
                console.log("Terdeteksi pertanyaan KR004 - menampilkan dengan opsi lengkap");

                // Buat ID pesan baru
                const newMessageId = `kr004_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

                // Tambahkan pesan baru dengan opsi kosong awalnya
                addMessage({
                    id: newMessageId,
                    text: botResponse.text,
                    user: false,
                    mode: 'survey',
                    questionObject: botResponse.questionObject,
                    questionCode: botResponse.questionObject.code,
                    options: [] // Mulai dengan opsi kosong, akan diisi melalui animasi
                });

                // Tampilkan semua opsi langsung
                setVisibleOptions(prev => ({
                    ...prev,
                    [newMessageId]: botResponse.questionObject?.options || []
                }));

                // Set message ini sebagai yang sedang dianimasi (untuk efek visual)
                setAnimatingMessageId(newMessageId);

                // Setelah sedikit delay, hentikan animasi
                setTimeout(() => {
                    setAnimatingMessageId(null);
                }, 500);
            } else {
                // Untuk pertanyaan lain, gunakan cara biasa
                updateLastMessage(botResponse.text, false);

                // Tambahkan ID pesan saat ini ke objek botResponse
                const currentMessageId = loadingMsgId;
                botResponse.id = currentMessageId;

                // Animasi opsi jika ini adalah pertanyaan dengan opsi
                if (botResponse.questionObject?.options?.length) {
                    animateOptions(currentMessageId, botResponse.questionObject.options);
                }
            }

            setBotIsTyping(false);

        } catch (error) {
            console.error("Error dalam mode survei:", error);
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        }
    };

    // Fungsi untuk menutup semua dropdown
    const closeAllDropdowns = () => {
        setSidebarOpen(false);
        setThemeMenuOpen(false);
    };

    return (
        <div className={`flex flex-col min-h-screen relative
            ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'}`}>

            {/* Background pattern with theme-aware colors */}
            <div
                className="absolute inset-0 z-0 bg-pattern"
                aria-hidden="true"
            />

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            {/* Mode Confirmation Popup */}
            <ModeConfirmationPopup
                isOpen={showModePopup}
                onClose={() => setShowModePopup(false)}
                onSwitchMode={handleSwitchToSurvey}
                isDarkMode={isDarkMode}
                countdown={popupCountdown}
            />

            {/* Sidebar */}
            <ChatSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isDarkMode={isDarkMode}
            />

            {/* Header */}
            <ChatHeader
                isDarkMode={isDarkMode}
                mode={mode}
                onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                themeMenuOpen={themeMenuOpen}
                setThemeMenuOpen={setThemeMenuOpen}
                closeOtherDropdowns={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <ChatMessageArea
                messages={messages}
                isDarkMode={isDarkMode}
                mode={mode}
                messagesEndRef={messagesEndRef}
                chatContainerRef={chatContainerRef}
                closeAllDropdowns={closeAllDropdowns}
                visibleOptions={visibleOptions}
                animatingMessageId={animatingMessageId}
                currentQuestion={currentQuestion}
            />

            {/* Scroll to Bottom Button */}
            <ChatScrollButton
                show={showScrollButton}
                isDarkMode={isDarkMode}
                onClick={handleScrollToBottom}
            />

            {/* Input Area */}
            <ChatInputArea
                input={input}
                setInput={setInput}
                isDarkMode={isDarkMode}
                mode={mode}
                setMode={setMode}
                botIsTyping={botIsTyping}
                onSend={handleSend}
                onStopGeneration={stopTokenGeneration}
                closeAllDropdowns={closeAllDropdowns}
            />
        </div>
    );
};

export default ChatLayout;