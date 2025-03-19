"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/hooks/useSurveyMessages";
import { useTheme } from "@/components/other/ThemeProvider";
import { generateUnorderedList } from "@/utils/otherUtils";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatScrollButton from "./ChatScrollButton";
import ChatInputArea from "./ChatInputArea";
import ChatMessageArea from "./ChatMessageArea";
import { queryRAG } from "@/services/survey/ragService";
import { getToken, getUserData, updateUserProperty, UserData } from "@/services/auth";
import { analyzeIntent } from "@/services/survey/intentAnalysis";
import { startSurvey, submitResponse } from "@/services/survey/surveyManagement";
import { Question, SurveyResponseResult } from "@/services/survey/types";

interface ChatLayoutProps {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    updateLastMessage: (text: string, user: boolean) => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
    messages,
    addMessage,
    updateLastMessage
}) => {
       // State
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [botIsTyping, setBotIsTyping] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const [mode, setMode] = useState<'survey' | 'qa'>('survey');
    
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
                const ragResponse = await queryRAG(userMessage);
                simulateTyping(ragResponse.answer);
            }
        } catch (error) {
            console.error("Error processing message:", error);
            updateLastMessage("Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", false);
            setBotIsTyping(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle survey mode logic
    const handleSurveyMode = async (userData: UserData, userMessage: string) => {
        const sessionId = userData?.activeSurveySessionId;

        // No active survey session
        if (!sessionId) {
            const intentResponse = await analyzeIntent(userMessage);

            if (intentResponse.success && intentResponse.data?.wants_to_start) {
                await startNewSurvey();
            } else {
                simulateTyping("Tidak masalah jika Anda belum siap untuk memulai survei. Silakan kirim pesan kapan saja jika Anda ingin memulai.");
            }
            return;
        }

        // User has active survey session
        const response = await submitResponse(sessionId, userMessage);
        if (!response.success) {
            simulateTyping("Terjadi kesalahan saat mengirim jawaban survei Anda.");
            return;
        }

        const botResponse = formatSurveyResponse(response);
        simulateTyping(botResponse);
    };

    // Start a new survey
    const startNewSurvey = async () => {
        const response = await startSurvey();

        if (!response.success) {
            throw new Error("Failed to start survey");
        }

        updateUserProperty('activeSurveySessionId', response.session_id);

        if (response.next_question) {
            simulateTyping(response.next_question.text);
        } else {
            simulateTyping("Pertanyaan berikutnya tidak tersedia.");
        }
    };

    // Format survey response
    const formatSurveyResponse = (response: SurveyResponseResult): string => {
        const { info, additional_info, next_question, currentQuestion,
            clarification_reason, follow_up_question, answer } = response;

        switch (info) {
            case "survey_completed":
                return additional_info || "Survei telah selesai.";

            case "expected_answer":
                if (!next_question) return "Pertanyaan berikutnya tidak tersedia.";
                return formatQuestion(next_question);

            case "unexpected_answer_or_other":
                if (!currentQuestion || !clarification_reason || !follow_up_question) {
                    return "Mohon berikan jawaban yang sesuai dengan pertanyaan.";
                }
                return `${clarification_reason} ${follow_up_question}\n\n${currentQuestion.code === "KR004"
                        ? `Pilih salah satu opsi di bawah ini: ${generateUnorderedList(currentQuestion.options || [], "◆")}`
                        : ""
                    }`;

            case "question":
                if (!currentQuestion || !answer) return "Silakan jawab pertanyaan saat ini.";
                return `${answer} \n\nPertanyaan saat ini: ${formatQuestion(currentQuestion)}`;

            case "error":
                return additional_info || "Terjadi kesalahan dalam memproses jawaban Anda.";

            default:
                return "Silakan lanjutkan menjawab pertanyaan survei.";
        }
    };

    // Format questions with options if needed
    const formatQuestion = (question: Question): string => {
        if (question.code === "KR004" && question.options?.length) {
            return `${question.text}\n\nPilih salah satu opsi di bawah ini: ${generateUnorderedList(question.options, "◆")}`;
        }
        return question.text;
    };

    // Simulate typing
    const simulateTyping = (response: string) => {
        const tokens = response.split(" ");
        let currentText = "";

        tokens.forEach((token, index) => {
            const timeout = setTimeout(() => {
                // Skip if generation has been stopped
                if (tokenGenerationRef.current.stopped) return;

                currentText += (index === 0 ? "" : " ") + token;
                updateLastMessage(currentText, false);

                // After last token, allow user to send messages again
                if (index === tokens.length - 1) {
                    setBotIsTyping(false);
                }
            }, index * 100);

            // Store timeout reference
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

            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

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