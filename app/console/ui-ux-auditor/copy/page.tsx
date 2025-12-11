"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Check, Copy } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function CopyTonePage() {
    const { t, language } = useLanguage()
    const [copy, setCopy] = useState("")
    const [tone, setTone] = useState("professional")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleAnalyze = () => {
        if (!copy) return
        setIsAnalyzing(true)
        setResult(null)

        // Simulate AI Analysis
        setTimeout(() => {
            setIsAnalyzing(false)
            if (language === 'tr') {
                setResult({
                    original: copy,
                    score: 72,
                    detectedTone: "Resmi",
                    rewrites: [
                        { tone: "Friendly", text: "Merhaba! Bugün size nasıl yardımcı olabiliriz?" },
                        { tone: "Professional", text: "Merhabalar, talebinizle ilgili size nasıl destek sağlayabiliriz?" },
                        { tone: "Excited", text: "Selam! Harika bir gün, size yardım etmek için sabırsızlanıyoruz!" }
                    ],
                    suggestions: [
                        "Daha aktif bir dil kullanın.",
                        "Cümleleri kısaltarak okunabilirliği artırın.",
                        "Kullanıcıya doğrudan hitap edin (Örn: 'Siz' dili)."
                    ]
                })
            } else if (language === 'de') {
                setResult({
                    original: copy,
                    score: 72,
                    detectedTone: "Formell",
                    rewrites: [
                        { tone: "Friendly", text: "Hallo! Wie können wir Ihnen heute helfen?" },
                        { tone: "Professional", text: "Guten Tag, wie können wir Sie bei Ihrem Anliegen unterstützen?" },
                        { tone: "Excited", text: "Hey! Wir freuen uns sehr, Ihnen beim Start zu helfen!" }
                    ],
                    suggestions: [
                        "Verwenden Sie Aktiv statt Passiv.",
                        "Verkürzen Sie Sätze, um die Lesbarkeit zu verbessern.",
                        "Konzentrieren Sie sich auf Nutzervorteile statt auf Funktionen."
                    ]
                })
            } else if (language === 'es') {
                setResult({
                    original: copy,
                    score: 72,
                    detectedTone: "Formal",
                    rewrites: [
                        { tone: "Friendly", text: "¡Hola! ¿Cómo podemos ayudarte hoy?" },
                        { tone: "Professional", text: "Hola, ¿cómo podemos asistirle con su solicitud?" },
                        { tone: "Excited", text: "¡Hola! ¡Estamos súper emocionados de ayudarte a empezar!" }
                    ],
                    suggestions: [
                        "Usa la voz activa en lugar de la pasiva.",
                        "Acorta las oraciones para mejorar la legibilidad.",
                        "Enfócate en los beneficios para el usuario en lugar de las características."
                    ]
                })
            } else {
                setResult({
                    original: copy,
                    score: 72,
                    detectedTone: "Formal",
                    rewrites: [
                        { tone: "Friendly", text: "Hi there! How can we help you out today?" },
                        { tone: "Professional", text: "Hello, how may we assist you with your request?" },
                        { tone: "Excited", text: "Hey! We're super excited to help you get started!" }
                    ],
                    suggestions: [
                        "Use active voice instead of passive.",
                        "Shorten sentences to improve readability.",
                        "Focus on user benefits rather than features."
                    ]
                })
            }
        }, 2000)
    }

    return (
        <div className="flex flex-col h-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('copyToneTitle')}</h2>
                    <p className="text-muted-foreground">
                        {t('copyToneDesc')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Panel: Input */}
                <div className="space-y-4">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>{t('inputCopy')}</CardTitle>
                            <CardDescription>
                                Paste your UI text, headlines, or error messages below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col space-y-4">
                            <Textarea
                                placeholder="e.g. Authentication failed. Please try again."
                                className="flex-1 min-h-[200px] resize-none p-4 text-base"
                                value={copy}
                                onChange={(e) => setCopy(e.target.value)}
                            />

                            <div className="flex items-center gap-4">
                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('selectTone')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="friendly">Friendly</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="flex-1"
                                    onClick={handleAnalyze}
                                    disabled={!copy || isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('analyzing')}
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 h-4 w-4" />
                                            {t('analyzeRewrite')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Output */}
                <div className="space-y-4">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in-50 duration-500">
                            {/* Score Card */}
                            <Card className="bg-primary/5 border-primary/20">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{t('clarityScore')}</p>
                                        <h3 className="text-4xl font-bold text-primary">{result.score}/100</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-muted-foreground">{t('detectedTone')}</p>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {result.detectedTone}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Rewrites */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('rewrites')}</CardTitle>
                                    <CardDescription>AI generated variations based on different tones.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {result.rewrites.map((item: any, index: number) => (
                                        <div key={index} className="space-y-2">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {item.tone}
                                            </div>
                                            <div className="flex items-start gap-2 p-3 bg-muted rounded-md group relative">
                                                <p className="text-sm flex-1">{item.text}</p>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-2 flex items-center gap-2">
                                    <Check className="h-4 w-4" /> {t('writingTips')}
                                </h4>
                                <ul className="list-disc list-inside text-sm space-y-1 text-yellow-700 dark:text-yellow-400">
                                    {result.suggestions.map((tip: string, index: number) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <Card className="h-full border-dashed">
                            <CardContent className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                                <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                                <p>Enter text on the left to see AI analysis and rewrites here.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
