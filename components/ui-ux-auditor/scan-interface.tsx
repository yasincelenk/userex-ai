"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanLine, Globe, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/LanguageContext"

interface ScanInterfaceProps {
    onScan: (url: string) => void
    isScanning: boolean
}

export function ScanInterface({ onScan, isScanning }: ScanInterfaceProps) {
    const { t } = useLanguage()
    const [url, setUrl] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) {
            setError(t('enterValidUrl'))
            return
        }
        if (!url.startsWith("http")) {
            setError(t('urlStartHttp'))
            return
        }
        setError("")
        onScan(url)
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="url-input" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {t('enterUrl')}
                        </label>
                        <div className="flex w-full items-center space-x-2">
                            <div className="relative flex-1">
                                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="url-input"
                                    type="url"
                                    placeholder="https://example.com"
                                    className="pl-9"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isScanning}
                                />
                            </div>
                            <Button type="submit" disabled={isScanning}>
                                {isScanning ? (
                                    <>
                                        <ScanLine className="mr-2 h-4 w-4 animate-spin" />
                                        {t('scanning')}
                                    </>
                                ) : (
                                    <>
                                        <ScanLine className="mr-2 h-4 w-4" />
                                        {t('runAudit')}
                                    </>
                                )}
                            </Button>
                        </div>
                        {error && (
                            <p className="text-sm font-medium text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </p>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
