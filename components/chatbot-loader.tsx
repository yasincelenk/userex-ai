"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"

interface ChatbotLoaderProps {
    chatbotId: string
    color?: string
}

export function ChatbotLoader({ chatbotId, color }: ChatbotLoaderProps) {
    // Use a ref to track if script is already injected to avoid duplicates in strict mode
    const scriptRef = useRef<HTMLScriptElement | null>(null)

    useEffect(() => {
        if (!chatbotId) return

        // Cleanup function to remove existing widget elements
        const cleanup = () => {
            const elementsToRemove = [
                'userex-chatbot-launcher',
                'userex-chatbot-container',
                'userex-voice-launcher',
                'userex-engagement-bubble',
                'userex-mobile-styles',
                'userex-animation-styles',
                'userex-engagement-animations',
                'userex-lucide-script'
            ]

            elementsToRemove.forEach(id => {
                const el = document.getElementById(id)
                if (el) el.remove()
            })

            // Remove the script tag itself if we tracked it
            if (scriptRef.current) {
                scriptRef.current.remove()
                scriptRef.current = null
            } else {
                // Fallback: try to find script by src if ref wasn't set (e.g. from previous nav)
                const scripts = document.querySelectorAll(`script[src*="/widget.js"]`)
                scripts.forEach(s => s.remove())
            }
        }

        // Run cleanup first to ensure clean slate
        cleanup()

        // Create and inject script
        const script = document.createElement("script")
        script.src = "/widget.js"
        script.dataset.chatbotId = chatbotId
        if (color) script.dataset.color = color
        script.async = true

        scriptRef.current = script
        document.body.appendChild(script)

        return () => {
            cleanup()
        }
    }, [chatbotId, color])

    return null
}
