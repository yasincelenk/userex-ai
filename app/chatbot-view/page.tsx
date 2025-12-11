"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MessageSquare, Send, Trash2, Sparkles, X, Maximize2, Minimize2, Mic, Volume2, Square, Headphones, PhoneOff } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ProductCard } from "@/components/chatbot/product-card"

// Extend Window interface for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

function ChatbotViewContent() {
    const searchParams = useSearchParams()
    const chatbotId = searchParams?.get("id") || "default"
    const [sessionId, setSessionId] = useState("")

    const [initialMessages, setInitialMessages] = useState<any[]>([])

    // Voice Support States
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState<string | null>(null) // Stores ID of message being spoken
    const recognitionRef = useRef<any>(null)
    const synthesisRef = useRef<SpeechSynthesis | null>(null)

    // Voice Mode (Hands-free) States
    const [isVoiceMode, setIsVoiceMode] = useState(false)
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

    // Initialize Speech Synthesis and Load Voices
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices()
                console.log("Loaded voices:", availableVoices.length)
                setVoices(availableVoices)
            }

            loadVoices()
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices
            }
        }
    }, [])

    // Handle Voice Input (Speech-to-Text) - Manual Mode
    const handleVoiceInput = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
            return
        }
        startRecognition(false)
    }

    const startRecognition = (continuous: boolean) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input. Please try Chrome or Edge.")
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = 'tr-TR' // Default to Turkish
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            console.log("Recognition started")
            setIsListening(true)
            if (continuous) setVoiceStatus('listening')
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            console.log("Recognition result:", transcript)
            if (continuous) {
                setVoiceStatus('processing')
                sendMessage(transcript)
            } else {
                setLocalInput(transcript)
            }
        }

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error)
            setIsListening(false)
            if (continuous && event.error !== 'aborted') {
                // If error in voice mode, maybe try to restart or go to idle?
                // For now, let's stop to avoid infinite error loops
                setVoiceStatus('idle')
            }
        }

        recognition.onend = () => {
            console.log("Recognition ended")
            setIsListening(false)
            // If in voice mode and not processing/speaking, restart listening
            if (isVoiceMode && voiceStatus !== 'processing' && voiceStatus !== 'speaking') {
                console.log("Restarting recognition in voice mode...")
                startRecognition(true)
            } else if (isVoiceMode) {
                // If processing or speaking, we wait for those to finish before restarting
                console.log("Voice mode active but busy (processing/speaking), waiting...")
            }
        }

        recognitionRef.current = recognition
        recognition.start()
    }

    // Handle Text-to-Speech
    const handleSpeak = (text: string, messageId: string, onEnd?: () => void) => {
        if (!synthesisRef.current) {
            console.error("SpeechSynthesis not initialized")
            return
        }

        console.log("Speaking:", text)

        // If already speaking this message, stop it
        if (isSpeaking === messageId) {
            synthesisRef.current.cancel()
            setIsSpeaking(null)
            return
        }

        // Cancel any current speech
        synthesisRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'tr-TR' // Default to Turkish

        // Try to select a Turkish voice
        const turkishVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'))
        if (turkishVoice) {
            utterance.voice = turkishVoice
            console.log("Using voice:", turkishVoice.name)
        } else {
            console.warn("No Turkish voice found, using default")
        }

        utterance.onend = () => {
            console.log("Speaking ended")
            setIsSpeaking(null)
            if (onEnd) onEnd()
        }
        utterance.onerror = (e) => {
            console.error("Speaking error:", e)
            setIsSpeaking(null)
            if (onEnd) onEnd()
        }

        setIsSpeaking(messageId)
        synthesisRef.current.speak(utterance)
    }

    // Toggle Voice Mode
    const toggleVoiceMode = () => {
        if (isVoiceMode) {
            // Turn off
            setIsVoiceMode(false)
            setVoiceStatus('idle')
            recognitionRef.current?.stop()
            synthesisRef.current?.cancel()
        } else {
            // Turn on
            setIsVoiceMode(true)
            startRecognition(true)
        }
    }

    // Typing Indicator State
    const [isTyping, setIsTyping] = useState(false)

    // Proactive Engagement State
    const [hasProactiveTriggered, setHasProactiveTriggered] = useState(false)
    const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Generate Session ID on mount and load history with real-time listener
    useEffect(() => {
        let sid = localStorage.getItem("chat_session_id")
        if (!sid) {
            sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            localStorage.setItem("chat_session_id", sid)
        }
        setSessionId(sid)

        // Real-time listener
        const docRef = doc(db, "chat_sessions", sid)
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.messages && Array.isArray(data.messages)) {
                    const history = data.messages.map((m: any, idx: number) => ({
                        id: m.id || `${sid}-${idx}`,
                        role: m.role,
                        content: m.content,
                        createdAt: m.createdAt ? new Date(m.createdAt) : new Date()
                    }))
                    setInitialMessages(history)
                }
            }
        }, (error) => {
            console.error("Error listening to chat history:", error)
        })

        return () => unsubscribe()
    }, [])

    // Local Input State to avoid useChat issues
    const [localInput, setLocalInput] = useState('')

    // Using minimal useChat for state management only - actual sending is done via custom sendMessage
    const [messages, setMessages] = useState<any[]>([])
    const [chatStatus, setChatStatus] = useState<'idle' | 'streaming' | 'submitted'>('idle')
    const isChatLoading = chatStatus === 'streaming' || chatStatus === 'submitted'

    // Voice mode callbacks handled in sendMessage function

    // Custom sendMessage function using fetch API
    const sendMessage = async (content: string) => {
        if (!content.trim()) return

        const userMessage = {
            id: 'user-' + Date.now(),
            role: 'user',
            content: content,
            createdAt: new Date()
        }
        setMessages((prev: any) => [...prev, userMessage])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    chatbotId,
                    sessionId
                })
            })

            if (!response.ok) throw new Error('Chat API error')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let assistantContent = ''
            const assistantMsgId = 'assistant-' + Date.now()

            // Add placeholder assistant message
            setMessages((prev: any) => [...prev, { id: assistantMsgId, role: 'assistant', content: '', createdAt: new Date() }])

            while (reader) {
                const { done, value } = await reader.read()
                if (done) break
                assistantContent += decoder.decode(value, { stream: true })
                setMessages((prev: any) => prev.map((m: any) => m.id === assistantMsgId ? { ...m, content: assistantContent } : m))
            }

            if (isVoiceMode && assistantContent) {
                setVoiceStatus('speaking')
                handleSpeak(assistantContent, assistantMsgId, () => {
                    if (isVoiceMode) startRecognition(true)
                })
            }
        } catch (error) {
            console.error('Chat error:', error)
            if (isVoiceMode) {
                setVoiceStatus('idle')
                handleSpeak("Üzgünüm, bir hata oluştu.", "error-" + Date.now())
            }
        }
    }

    // Proactive Engagement Logic (Time-on-Page)
    useEffect(() => {
        if (hasProactiveTriggered || messages.length > 0) return

        proactiveTimerRef.current = setTimeout(() => {
            const proactiveMsg = {
                id: 'proactive-' + Date.now(),
                role: 'assistant',
                content: "👋 Hi! I noticed you've been looking around. deeper? I can help you find specific products or answer questions.",
                createdAt: new Date()
            }
            setMessages(prev => [...prev, proactiveMsg as any])
            setHasProactiveTriggered(true)
        }, 30000) // 30 seconds

        return () => {
            if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current)
        }
    }, [hasProactiveTriggered, messages.length, setMessages])

    // Update isTyping based on isLoading from useChat
    useEffect(() => {
        setIsTyping(isChatLoading)
    }, [isChatLoading])

    // Safety Timeout for Voice Mode
    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (voiceStatus === 'processing') {
            timeout = setTimeout(() => {
                if (voiceStatus === 'processing') {
                    console.warn("Voice processing timed out")
                    setVoiceStatus('idle')
                    handleSpeak("Yanıt vermem biraz uzun sürdü. Lütfen tekrar dener misiniz?", "timeout-" + Date.now())
                }
            }, 45000) // 45 seconds timeout
        }
        return () => clearTimeout(timeout)
    }, [voiceStatus])

    // Sync initialMessages to useChat messages when loaded
    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages)
        }
    }, [initialMessages, setMessages])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const [hasRequestedContactInfo, setHasRequestedContactInfo] = useState(false)
    const [hasCapturedInChatLead, setHasCapturedInChatLead] = useState(false)
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)


    const [isConfirmingClear, setIsConfirmingClear] = useState(false)

    const handleClearChat = () => {
        setIsConfirmingClear(true)
    }

    const handleCloseWidget = () => {
        window.parent.postMessage({ type: 'USEREX_CLOSE_WIDGET' }, '*')
    }

    const [isExpanded, setIsExpanded] = useState(false)
    const handleToggleSize = () => {
        const newExpandedState = !isExpanded
        setIsExpanded(newExpandedState)
        window.parent.postMessage({ type: 'USEREX_TOGGLE_SIZE', isExpanded: newExpandedState }, '*')
    }

    const confirmClear = () => {
        setMessages([])
        const newSid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        localStorage.setItem("chat_session_id", newSid)
        setSessionId(newSid)
        setIsConfirmingClear(false)
        setHasRequestedContactInfo(false)
    }

    const cancelClear = () => {
        setIsConfirmingClear(false)
    }

    const [settings, setSettings] = useState({
        companyName: "Acme Corp",
        welcomeMessage: "Hello! How can I help you today?",
        brandColor: "#000000",
        brandLogo: "",
        suggestedQuestions: ["What are your pricing plans?", "How do I get started?", "Contact support"],
        enableLeadCollection: false
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const docRef = doc(db, "chatbots", chatbotId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setSettings({
                        companyName: data.companyName || "Acme Corp",
                        welcomeMessage: data.welcomeMessage || "Hello! How can I help you today?",
                        brandColor: data.brandColor || "#000000",
                        brandLogo: data.brandLogo || "",
                        suggestedQuestions: data.suggestedQuestions || ["What are your pricing plans?", "How do I get started?", "Contact support"],
                        enableLeadCollection: data.enableLeadCollection || false
                    })
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [chatbotId])

    const contactMessages = {
        tr: "Müşteri temsilcilerimizin sizinle iletişime geçebilmesi için Ad, Soyad, Firma ve İletişim bilgilerinizi paylaşabilir misiniz?",
        en: "Could you please share your Name, Surname, Company, and Contact Information so our customer representatives can contact you?",
        de: "Könnten Sie bitte Ihren Namen, Nachnamen, Ihre Firma und Ihre Kontaktinformationen mitteilen, damit unsere Kundenbetreuer Sie kontaktieren können?",
        es: "¿Podría compartir su Nombre, Apellido, Empresa e Información de contacto para que nuestros representantes de atención al cliente puedan contactarlo?",
        fr: "Pourriez-vous partager votre Nom, Prénom, Entreprise et Coordonnées afin que nos représentants du service client puissent vous contacter ?"
    }

    const detectLanguage = (text: string): keyof typeof contactMessages => {
        const trChars = /[çğıöşüÇĞİÖŞÜ]/
        if (trChars.test(text)) return 'tr'

        // Simple fallback to browser language if available, otherwise 'en'
        if (typeof window !== 'undefined' && window.navigator.language) {
            const lang = window.navigator.language.split('-')[0]
            if (lang in contactMessages) return lang as keyof typeof contactMessages
        }

        return 'en'
    }

    useEffect(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current)
        }

        // If lead collection is disabled, do nothing
        if (!isLoading && !settings.enableLeadCollection) return

        const userMessageCount = messages.filter(m => m.role === 'user').length
        // Check if ANY of the contact messages have been sent
        const alreadyRequested = messages.some(m => Object.values(contactMessages).includes(m.content))

        if (alreadyRequested) {
            if (!hasRequestedContactInfo) setHasRequestedContactInfo(true)

            // Check for response to contact request
            const lastMsg = messages[messages.length - 1]
            const secondLastMsg = messages[messages.length - 2]

            if (
                messages.length >= 2 &&
                lastMsg.role === 'user' &&
                secondLastMsg.role === 'assistant' &&
                Object.values(contactMessages).includes(secondLastMsg.content) &&
                !hasCapturedInChatLead
            ) {
                // Parse lead info
                const text = lastMsg.content
                const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
                const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)

                const email = emailMatch ? emailMatch[0] : ""
                const phone = phoneMatch ? phoneMatch[0] : ""
                const name = text.length < 50 ? text : "In-Chat User"

                // Send to API
                fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatbotId,
                        name: name,
                        email: email,
                        phone: phone,
                        source: "In-Chat Conversation"
                    })
                }).then(res => {
                    if (res.ok) {
                        console.log("In-chat lead captured")
                        setHasCapturedInChatLead(true)
                    }
                }).catch(err => console.error("Error capturing in-chat lead:", err))
            }

            return
        }

        if (userMessageCount >= 2 && !hasRequestedContactInfo && !isChatLoading) {
            inactivityTimerRef.current = setTimeout(() => {
                // Detect language from the last user message
                const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
                const lang = lastUserMsg ? detectLanguage(lastUserMsg.content) : 'en'
                const messageContent = contactMessages[lang] || contactMessages['en']

                const contactMsg = {
                    id: 'contact-request-' + Date.now(),
                    role: 'assistant',
                    content: messageContent,
                    createdAt: new Date()
                }
                setMessages([...messages, contactMsg as any])
                setHasRequestedContactInfo(true)

                if (sessionId) {
                    const sessionRef = doc(db, "chat_sessions", sessionId)
                    updateDoc(sessionRef, {
                        messages: arrayUnion({
                            id: contactMsg.id,
                            role: contactMsg.role,
                            content: contactMsg.content,
                            createdAt: contactMsg.createdAt.toISOString()
                        })
                    }).catch(e => console.error("Error saving contact request:", e))
                }
            }, 30000)
        }

        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current)
            }
        }
    }, [messages, localInput, hasRequestedContactInfo, setMessages, isChatLoading, sessionId, hasCapturedInChatLead, chatbotId, settings.enableLeadCollection, isLoading])

    const [showLeadForm, setShowLeadForm] = useState(false)
    const [leadName, setLeadName] = useState("")
    const [leadEmail, setLeadEmail] = useState("")
    const [leadPhone, setLeadPhone] = useState("")
    const [isSubmittingLead, setIsSubmittingLead] = useState(false)

    useEffect(() => {
        if (!isLoading && settings.enableLeadCollection) {
            const storedLead = localStorage.getItem(`lead_${chatbotId}`)
            if (!storedLead) {
                setShowLeadForm(true)
            }
        }
    }, [isLoading, settings.enableLeadCollection, chatbotId])

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmittingLead(true)

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId,
                    name: leadName,
                    email: leadEmail,
                    phone: leadPhone
                })
            })

            if (res.ok) {
                localStorage.setItem(`lead_${chatbotId}`, JSON.stringify({ name: leadName, email: leadEmail, phone: leadPhone }))
                setShowLeadForm(false)
            }
        } catch (error) {
            console.error("Error submitting lead:", error)
        } finally {
            setIsSubmittingLead(false)
        }
    }

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-50">Loading...</div>
    }

    return (
        <div className="flex flex-col h-screen bg-white font-sans text-gray-900 relative overflow-hidden">
            {/* Lead Collection Overlay */}
            {showLeadForm && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center space-y-2">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto overflow-hidden"
                                style={{ backgroundColor: settings.brandColor }}
                            >
                                {settings.brandLogo ? (
                                    <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <MessageSquare className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
                            <p className="text-sm text-gray-500">Please provide your details to start chatting.</p>
                        </div>

                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    id="name"
                                    required
                                    type="text"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    style={{ '--tw-ring-color': settings.brandColor } as any}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    required
                                    type="email"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    style={{ '--tw-ring-color': settings.brandColor } as any}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={leadPhone}
                                    onChange={(e) => setLeadPhone(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    style={{ '--tw-ring-color': settings.brandColor } as any}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmittingLead}
                                className="w-full py-3 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                                style={{ backgroundColor: settings.brandColor }}
                            >
                                {isSubmittingLead ? "Starting..." : "Start Chatting"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Voice Mode Overlay */}
            {isVoiceMode && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <button
                        onClick={toggleVoiceMode}
                        className="absolute top-6 right-6 p-4 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>

                    <div className="relative flex items-center justify-center mb-12">
                        {/* Pulsing Rings */}
                        <div className={`absolute w-64 h-64 rounded-full border-4 border-blue-100 ${voiceStatus === 'listening' || voiceStatus === 'speaking' ? 'animate-ping opacity-20' : 'opacity-0'}`} style={{ borderColor: settings.brandColor }}></div>
                        <div className={`absolute w-48 h-48 rounded-full border-4 border-blue-200 ${voiceStatus === 'listening' || voiceStatus === 'speaking' ? 'animate-pulse opacity-40' : 'opacity-0'}`} style={{ borderColor: settings.brandColor }}></div>

                        {/* Main Circle */}
                        <div
                            className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500"
                            style={{
                                backgroundColor: settings.brandColor,
                                transform: voiceStatus === 'speaking' ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            {voiceStatus === 'listening' && <Mic className="w-12 h-12 text-white animate-pulse" />}
                            {voiceStatus === 'processing' && <Sparkles className="w-12 h-12 text-white animate-spin" />}
                            {voiceStatus === 'speaking' && <Volume2 className="w-12 h-12 text-white" />}
                            {voiceStatus === 'idle' && <Headphones className="w-12 h-12 text-white" />}
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {voiceStatus === 'listening' && "Dinliyorum..."}
                            {voiceStatus === 'processing' && "Düşünüyorum..."}
                            {voiceStatus === 'speaking' && "Konuşuyorum..."}
                            {voiceStatus === 'idle' && "Hazır"}
                        </h2>
                        <p className="text-gray-500">
                            {voiceStatus === 'listening' ? "Konuşmaya başlayın" : "Lütfen bekleyin"}
                        </p>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {isConfirmingClear && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full animate-in zoom-in-95 duration-200">
                        <h3 className="font-semibold text-lg mb-2">Clear History?</h3>
                        <p className="text-sm text-gray-500 mb-4">This will delete your current conversation. This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelClear}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClear}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                            >
                                Clear Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-4 border-b shadow-sm sticky top-0 z-10 transition-colors duration-300"
                style={{ backgroundColor: settings.brandColor, borderColor: 'rgba(0,0,0,0.05)' }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden bg-white/20"
                    >
                        {settings.brandLogo ? (
                            <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <MessageSquare className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm leading-tight text-white">{settings.companyName}</h3>
                        <p className="text-[10px] text-white/80 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {/* <button
                        onClick={toggleVoiceMode}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Voice Assistant Mode"
                    >
                        <Headphones className="w-4 h-4" />
                    </button> */}
                    <button
                        onClick={handleToggleSize}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden sm:block"
                        title={isExpanded ? "Minimize" : "Maximize"}
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleClearChat}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Clear Chat"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCloseWidget}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Close Widget"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-8 animate-in fade-in duration-700 slide-in-from-bottom-4 fill-mode-forwards">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-2 overflow-hidden"
                            style={{ backgroundColor: settings.brandColor }}
                        >
                            {settings.brandLogo ? (
                                <img src={settings.brandLogo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <Sparkles className="w-8 h-8" />
                            )}
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <h2 className="text-xl font-bold text-gray-800">Welcome to {settings.companyName}</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {settings.welcomeMessage}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                            {settings.suggestedQuestions.filter(q => q.trim() !== "").map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        sendMessage(q)
                                    }}
                                    className="text-xs text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all hover:shadow-sm text-gray-600 shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Welcome Message as first item if desired, or just chat flow */}
                        <div className="flex gap-4 max-w-3xl mx-auto">
                            <div
                                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white mt-1"
                                style={{ backgroundColor: settings.brandColor }}
                            >
                                AI
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-gray-500">{settings.companyName}</p>
                                <div className="text-sm text-gray-800 leading-relaxed">
                                    {settings.welcomeMessage}
                                </div>
                            </div>
                        </div>

                        {messages.map((m: any) => (
                            <div key={m.id} className={`flex gap-4 max-w-3xl mx-auto ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div
                                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs mt-1 shadow-sm ${m.role === 'user' ? 'bg-gray-100 text-gray-600' : 'text-white'}`}
                                    style={m.role === 'assistant' ? { backgroundColor: settings.brandColor } : {}}
                                >
                                    {m.role === 'user' ? 'You' : 'AI'}
                                </div>
                                <div className={`space-y-1 max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className="flex items-center gap-2 justify-between px-1">
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{m.role === 'user' ? 'You' : settings.companyName}</p>
                                        {m.role === 'assistant' && (
                                            <button
                                                onClick={() => handleSpeak(m.content, m.id)}
                                                className="text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                                                title={isSpeaking === m.id ? "Stop Speaking" : "Read Aloud"}
                                            >
                                                {isSpeaking === m.id ? <Square className="w-3 h-3 fill-current" /> : <Volume2 className="w-3 h-3" />}
                                            </button>
                                        )}
                                    </div>
                                    <div
                                        className={`text-sm leading-relaxed p-3.5 rounded-2xl shadow-sm inline-block text-left relative group ${m.role === 'user'
                                            ? 'bg-blue-50 text-gray-800 rounded-tr-none border border-blue-100'
                                            : 'bg-white border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                // Function to detect and render Product Card JSON/Format
                                                code: ({ node, inline, className, children, ...props }: any) => {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    const content = String(children).replace(/\n$/, '')

                                                    // Detect Product JSON (Simple heuristic)
                                                    if (content.trim().startsWith('{') && content.includes('"price"')) {
                                                        try {
                                                            const product = JSON.parse(content)
                                                            if (product.name && product.price) {
                                                                return <ProductCard product={product} brandColor={settings.brandColor} />
                                                            }
                                                        } catch (e) {
                                                            // Not valid JSON, ignore
                                                        }
                                                    }

                                                    return !inline && match ? (
                                                        <div className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-x-auto my-2">
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-red-500" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                table: ({ node, ...props }) => <table className="border-collapse table-auto w-full text-xs my-2" {...props} />,
                                                th: ({ node, ...props }) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold" {...props} />,
                                                td: ({ node, ...props }) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1" {...props} />,
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div
                                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-white mt-1 shadow-sm"
                                    style={{ backgroundColor: settings.brandColor }}
                                >
                                    AI
                                </div>
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                <div className="max-w-3xl mx-auto relative">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (!localInput.trim()) return
                            sendMessage(localInput)
                            setLocalInput('')
                        }}
                        className="relative flex items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <input
                                value={localInput}
                                onChange={(e) => setLocalInput(e.target.value)}
                                type="text"
                                placeholder="Message..."
                                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent transition-all shadow-sm"
                                style={{ '--tw-ring-color': settings.brandColor } as any}
                            />
                            {/* <button
                                type="button"
                                onClick={handleVoiceInput}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                title="Voice Input"
                            >
                                <Mic className="w-4 h-4" />
                            </button> */}
                        </div>
                        <button
                            type="submit"
                            disabled={!localInput.trim()}
                            className="p-3 rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-sm"
                            style={{ backgroundColor: settings.brandColor }}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400">
                            Powered by <span className="font-semibold">Userex AI</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatbotView() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-white">Loading...</div>}>
            <ChatbotViewContent />
        </Suspense>
    )
}
