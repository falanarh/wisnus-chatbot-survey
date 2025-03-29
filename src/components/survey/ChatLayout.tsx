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
    addMessage: (message: ChatMessage) => void;
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

    // First, we'll need to track the state of option animation
    const [optionsAnimating, setOptionsAnimating] = useState(false);
    const [visibleOptions, setVisibleOptions] = useState<string[]>([]);

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
    }, [messages, userHasScrolled]);

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

    // Perbarui fungsi handleSwitchToSurvey
    const handleSwitchToSurvey = async () => {
        setMode('survey');
        setShowModePopup(false);

        // Membersihkan timer mode QA
        if (qaTimerRef.current) {
            clearTimeout(qaTimerRef.current);
            qaTimerRef.current = null;
        }

        // Menampilkan pesan loading
        addMessage({
            text: "Beralih ke mode survei...",
            user: false,
            mode: 'survey',
            loading: true
        });

        try {
            // Mendapatkan pertanyaan saat ini dari API
            const response = await getCurrentQuestion();

            let pesanTeks = "Mode berubah ke survei. Mari lanjutkan survei Anda.";
            let questionObject: Question | undefined = undefined;

            if (response.success && response.data) {
                const { status, current_question, message } = response.data;

                if (status === "COMPLETED") {
                    pesanTeks += message || "Survei telah selesai. Terima kasih atas partisipasi Anda.";
                } else if (current_question) {
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
                    pesanTeks += `\n\nPertanyaan saat ini: ${current_question.text}`;
                    questionObject = current_question;
                } else {
                    pesanTeks += "Mari lanjutkan survei Anda.";
                }
            } else {
                // Pesan cadangan jika panggilan API gagal
                pesanTeks += "Mari lanjutkan survei Anda. Jika Anda membutuhkan bantuan, Anda dapat bertanya kapan saja.";
            }

            // Pass the question object if it exists
            simulateTyping(pesanTeks, questionObject);

        } catch (error) {
            // Jika terjadi kesalahan, tampilkan pesan umum
            updateLastMessage("Mode berubah ke survei. Mari lanjutkan survei Anda.", false);
            console.error("Kesalahan saat mendapatkan pertanyaan saat ini:", error);
        }
    };

    // Send message handler
    const handleSend = async () => {
        if (!input.trim() || loading || botIsTyping) return;

        const userMessage = input.trim();
        setInput("");
        addMessage({ text: userMessage, user: true, mode: mode });

        setLoading(true);
        setBotIsTyping(true);
        setUserHasScrolled(false);

        // Reset token generation state
        tokenGenerationRef.current = {
            stopped: false,
            timeouts: []
        };

        // Add loading message
        addMessage({ text: "", user: false, loading: true, mode: mode });

        try {
            const token = getToken();
            const userData = getUserData();

            if (!token) throw new Error("Authentication token not found");
            if (!userData) throw new Error("User data not found");

            if (mode === 'survey') {
                await handleSurveyMode(userData, userMessage);
            } else {
                await handleQaMode(userMessage);

                // Reset QA mode timer on each interaction
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

    const handleQaMode = async (userMessage: string) => {
        try {
            const ragResponse = await queryRAG(userMessage);
            const surveyMessage: SurveyMessageRequest = {
                user_message: userMessage,
                system_response: { answer: ragResponse.answer },
                mode: 'qa'
            };
            await addSurveyMessage(surveyMessage);
            simulateTyping(ragResponse.answer);
        } catch (error) {
            console.error("Error processing message:", error);
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        }
    };

    // Handle survey mode logic
    const handleSurveyMode = async (userData: UserData, userMessage: string) => {
        // Use sessionId from state or from userData
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
            
            // Pass the question object if it exists
            simulateTyping(botResponse.text, botResponse.questionObject);
    
        } catch (error) {
            console.error("Error dalam mode survei:", error);
            simulateTyping("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.");
        }
    };

    // Simulate typing with support for options animation
    const simulateTyping = (response: string, question?: Question) => {
        const tokens = response.split(" ");
        let currentText = "";

        // Reset options state
        setVisibleOptions([]);

        tokens.forEach((token, index) => {
            const timeout = setTimeout(() => {
                // Skip if generation has been stopped
                if (tokenGenerationRef.current.stopped) return;

                currentText += (index === 0 ? "" : " ") + token;
                updateLastMessage(currentText, false);

                // After last token, allow user to send messages again and start options animation
                if (index === tokens.length - 1) {
                    setBotIsTyping(false);

                    // Start animating options if it's KR004 question
                    if (question?.code === "KR004" && question.options?.length) {
                        animateOptions(question.options);
                    }
                }
            }, index * 100);

            // Store timeout reference
            tokenGenerationRef.current.timeouts.push(timeout);
        });
    };

    // New function to animate showing the options
    const animateOptions = (options: string[]) => {
        setOptionsAnimating(true);
        let currentOptions: string[] = [];

        options.forEach((option, index) => {
            const timeout = setTimeout(() => {
                // Skip if generation has been stopped
                if (tokenGenerationRef.current.stopped) return;

                currentOptions = [...options.slice(0, index + 1)];
                setVisibleOptions(currentOptions);

                // After last option, mark animation as complete
                if (index === options.length - 1) {
                    setOptionsAnimating(false);
                }
            }, index * 300); // Slightly slower than text to make it noticeable

            // Store timeout references
            tokenGenerationRef.current.timeouts.push(timeout);
        });
    };

    // Function to close all dropdowns
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
                optionsAnimating={optionsAnimating}
                visibleOptions={visibleOptions}
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