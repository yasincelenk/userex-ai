"use client"

import PhoneInputLib from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from "@/lib/utils"

interface PhoneInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    defaultCountry?: "TR" | "US" | "GB" | "DE"
}

export function PhoneInput({
    value,
    onChange,
    placeholder = "0501 234 56 78",
    className,
    defaultCountry = "TR"
}: PhoneInputProps) {
    return (
        <div className={cn(
            "phone-input-wrapper",
            "[&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-10 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-input [&_.PhoneInputInput]:bg-background [&_.PhoneInputInput]:px-3 [&_.PhoneInputInput]:py-2 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:ring-offset-background [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputInput]:focus-visible:ring-2 [&_.PhoneInputInput]:focus-visible:ring-ring [&_.PhoneInputInput]:focus-visible:ring-offset-2 [&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:opacity-50",
            "[&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:top-0 [&_.PhoneInputCountrySelect]:bottom-0 [&_.PhoneInputCountrySelect]:left-0 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer",
            "[&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:h-4",
            "[&_.PhoneInputCountryIconImg]:w-5 [&_.PhoneInputCountryIconImg]:h-4",
            className
        )}>
            <PhoneInputLib
                international
                defaultCountry={defaultCountry}
                value={value}
                onChange={(val) => onChange(val || '')}
                placeholder={placeholder}
            />
        </div>
    )
}
