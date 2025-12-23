"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
    password: string
    className?: string
}

interface Requirement {
    label: string
    met: boolean
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
    const requirements: Requirement[] = [
        { label: "At least 12 characters", met: password.length >= 12 },
        { label: "Uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Number", met: /[0-9]/.test(password) },
        { label: "Special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]

    const allMet = requirements.every((r) => r.met)

    return (
        <div className={cn("grid grid-cols-2 gap-x-4 gap-y-1 text-xs", className)}>
            {requirements.map((req, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex items-center gap-1.5 transition-colors",
                        req.met ? "text-green-600 dark:text-green-400" : "text-zinc-400 dark:text-zinc-500"
                    )}
                >
                    {req.met ? (
                        <Check className="h-3 w-3" />
                    ) : (
                        <X className="h-3 w-3" />
                    )}
                    <span>{req.label}</span>
                </div>
            ))}
        </div>
    )
}

export function isPasswordStrong(password: string): boolean {
    return (
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    )
}
