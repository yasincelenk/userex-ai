"use client"

import { useState } from "react"
import { UploadZone } from "@/components/ui-ux-auditor/upload-zone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Palette, Layout, MousePointerClick } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function VisualAnalysisPage() {
    const { t, language } = useLanguage()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)

    const handleFileSelect = async (file: File) => {
        setIsAnalyzing(true)
        setAnalysisResult(null)
        // Simulate AI Analysis
        setTimeout(() => {
            setIsAnalyzing(false)
            if (language === 'tr') {
                setAnalysisResult({
                    score: 78,
                    details: "Görsel hiyerarşi güçlü, ancak harekete geçirici mesaj (CTA) yeterince belirgin değil.",
                    suggestions: [
                        { icon: Palette, text: "Kontrast oranını artırın." },
                        { icon: Layout, text: "Boşluk dağılımını iyileştirin." },
                        { icon: MousePointerClick, text: "Düğmeleri daha görünür yapın." }
                    ]
                })
            } else if (language === 'de') {
                setAnalysisResult({
                    score: 78,
                    details: "Die visuelle Hierarchie ist stark, aber der Call-to-Action (CTA) ist nicht prominent genug.",
                    suggestions: [
                        { icon: Palette, text: "Kontrastverhältnis für primäre Schaltflächen erhöhen." },
                        { icon: Layout, text: "Verteilung des Leerraums im Hero-Bereich verbessern." },
                        { icon: MousePointerClick, text: "Interaktive Elemente deutlicher unterscheidbar machen." }
                    ]
                })
            } else if (language === 'es') {
                setAnalysisResult({
                    score: 78,
                    details: "La jerarquía visual es fuerte, pero la llamada a la acción (CTA) carece de prominencia.",
                    suggestions: [
                        { icon: Palette, text: "Aumentar la relación de contraste para los botones principales." },
                        { icon: Layout, text: "Mejorar la distribución del espacio en blanco en la sección hero." },
                        { icon: MousePointerClick, text: "Hacer que los elementos interactivos sean más distinguibles." }
                    ]
                })
            } else {
                setAnalysisResult({
                    score: 78,
                    details: "Visual hierarchy is strong, but the call-to-action (CTA) lacks prominence.",
                    suggestions: [
                        { icon: Palette, text: "Increase contrast ratio for primary buttons." },
                        { icon: Layout, text: "Improve whitespace distribution in the hero section." },
                        { icon: MousePointerClick, text: "Make interactive elements more distinguishable." }
                    ]
                })
            }
        }, 2000)
    }

    return (
        <div className="flex flex-col h-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('visualAnalysisTitle')}</h2>
                    <p className="text-muted-foreground">
                        {t('visualAnalysisDesc')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>{t('interfaceUpload')}</CardTitle>
                        <CardDescription>
                            {t('uploadToAnalyze')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>{t('analysisResult')}</CardTitle>
                        <CardDescription>
                            AI-powered insights.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">{t('analyzing')}</p>
                            </div>
                        ) : analysisResult ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-semibold mb-2">Overall Score: {analysisResult.score}/100</h4>
                                    <p>{analysisResult.details}</p>
                                </div>
                                <div className="space-y-2">
                                    {analysisResult.suggestions.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3 p-2 border rounded hover:bg-muted/50 transition-colors">
                                            <item.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2 text-muted-foreground">
                                <Layout className="h-10 w-10 opacity-20" />
                                <p>{t('uploadToAnalyze')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
