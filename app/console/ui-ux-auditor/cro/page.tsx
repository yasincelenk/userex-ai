"use client"

import { useState } from "react"
import { UploadZone } from "@/components/ui-ux-auditor/upload-zone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, MousePointerClick, Target, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function CroSuggestionsPage() {
    const { t, language } = useLanguage()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleFileSelect = (file: File) => {
        setIsAnalyzing(true)
        setResult(null)

        // Simulate AI Analysis
        setTimeout(() => {
            setIsAnalyzing(false)
            if (language === 'tr') {
                setResult({
                    conversionScore: 58,
                    elements: [
                        {
                            type: "Birincil CTA",
                            status: "warning",
                            observation: "Düğme rengi arka planla karışıyor.",
                            suggestion: "Patlaması için düğme rengini yüksek kontrastlı bir vurgu rengiyle değiştirin (örn: #FF5733).",
                            impact: "Yüksek"
                        },
                        {
                            type: "Başlık",
                            status: "pass",
                            observation: "Değer önerisi açık ve net.",
                            suggestion: "Aciliyete odaklanan bir varyantı test etmeyi düşünün.",
                            impact: "Düşük"
                        },
                        {
                            type: "Güven Sinyalleri",
                            status: "fail",
                            observation: "Ödeme yakınında sosyal kanıt veya güvenlik rozetleri görünmüyor.",
                            suggestion: "Düğmenin altına müşteri logoları veya 'Güvenli Ödeme' rozeti ekleyin.",
                            impact: "Yüksek"
                        },
                        {
                            type: "Form Alanları",
                            status: "warning",
                            observation: "Üst kısımda 5 giriş alanı görünüyor.",
                            suggestion: "İsteğe bağlı alanları gizleyerek veya çok adımlı form kullanarak sürtünmeyi azaltın.",
                            impact: "Orta"
                        }
                    ],
                    abTestIdeas: [
                        "Mobilde yapışkan bir CTA çubuğu test edin.",
                        "'Şimdi Satın Al' yerine 'Ücretsiz Başla'yı deneyin.",
                        "Sınırlı teklif için bir geri sayım sayacı ekleyin."
                    ]
                })
            } else if (language === 'de') {
                setResult({
                    conversionScore: 58,
                    elements: [
                        {
                            type: "Primärer CTA",
                            status: "warning",
                            observation: "Buttonfarbe verschmilzt mit dem Hintergrund.",
                            suggestion: "Ändern Sie die Buttonfarbe in eine kontrastreiche Akzentfarbe (z. B. #FF5733).",
                            impact: "Hoch"
                        },
                        {
                            type: "Überschrift",
                            status: "pass",
                            observation: "Wertversprechen ist klar und prägnant.",
                            suggestion: "Testen Sie eine Variante, die sich auf Dringlichkeit konzentriert.",
                            impact: "Niedrig"
                        },
                        {
                            type: "Vertrauenssignale",
                            status: "fail",
                            observation: "Keine sozialen Beweise oder Sicherheitsabzeichen in der Nähe der Kasse sichtbar.",
                            suggestion: "Fügen Sie Kundenlogos oder 'Sicheres Bezahlen'-Abzeichen unter dem Button hinzu.",
                            impact: "Hoch"
                        },
                        {
                            type: "Formularfelder",
                            status: "warning",
                            observation: "5 Eingabefelder im sichtbaren Bereich.",
                            suggestion: "Reduzieren Sie Reibung, indem Sie optionale Felder ausblenden oder mehrstufige Formulare verwenden.",
                            impact: "Mittel"
                        }
                    ],
                    abTestIdeas: [
                        "Testen Sie eine klebrige CTA-Leiste auf Mobilgeräten.",
                        "Experimentieren Sie mit 'Kostenlos starten' vs. 'Jetzt kaufen'.",
                        "Fügen Sie einen Countdown-Timer für das begrenzte Angebot hinzu."
                    ]
                })
            } else if (language === 'es') {
                setResult({
                    conversionScore: 58,
                    elements: [
                        {
                            type: "CTA principal",
                            status: "warning",
                            observation: "El color del botón se mezcla con el fondo.",
                            suggestion: "Cambia el color del botón a un color de acento de alto contraste (p. ej., #FF5733).",
                            impact: "Alto"
                        },
                        {
                            type: "Titular",
                            status: "pass",
                            observation: "La propuesta de valor es clara y concisa.",
                            suggestion: "Considera probar una variante que se centre en la urgencia.",
                            impact: "Bajo"
                        },
                        {
                            type: "Señales de confianza",
                            status: "fail",
                            observation: "No hay pruebas sociales ni insignias de seguridad visibles cerca del pago.",
                            suggestion: "Agrega logotipos de clientes o insignia de 'Pago seguro' debajo del botón.",
                            impact: "Alto"
                        },
                        {
                            type: "Form Fields",
                            status: "warning",
                            observation: "5 campos visibles en la parte superior.",
                            suggestion: "Reduce la fricción ocultando campos opcionales o usando un formulario de varios pasos.",
                            impact: "Medio"
                        }
                    ],
                    abTestIdeas: [
                        "Prueba una barra de CTA adhesiva en móviles.",
                        "Experimenta con 'Empezar gratis' vs 'Comprar ahora'.",
                        "Agrega un temporizador de cuenta regresiva para la oferta limitada."
                    ]
                })
            } else {
                setResult({
                    conversionScore: 58,
                    elements: [
                        {
                            type: "Primary CTA",
                            status: "warning",
                            observation: "Button color blends with background.",
                            suggestion: "Change button color to a high-contrast accent color (e.g., #FF5733) to make it pop.",
                            impact: "High"
                        },
                        {
                            type: "Headline",
                            status: "pass",
                            observation: "Value proposition is clear and concise.",
                            suggestion: "Consider testing a variant that focuses on urgency.",
                            impact: "Low"
                        },
                        {
                            type: "Trust Signals",
                            status: "fail",
                            observation: "No social proof or security badges visible near checkout.",
                            suggestion: "Add customer logos or 'Secure Checkout' badge below the button.",
                            impact: "High"
                        },
                        {
                            type: "Form Fields",
                            status: "warning",
                            observation: "5 inputs visible above the fold.",
                            suggestion: "Reduce friction by hiding optional fields or using multi-step form.",
                            impact: "Medium"
                        }
                    ],
                    abTestIdeas: [
                        "Test a sticky CTA bar on mobile.",
                        "Experiment with 'Get Started for Free' vs 'Buy Now'.",
                        "Add a countdown timer for the limited offer."
                    ]
                })
            }
        }, 2500)
    }

    return (
        <div className="flex flex-col h-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('croTitle')}</h2>
                    <p className="text-muted-foreground">
                        {t('croDesc')}
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
                        <CardTitle>{t('optimizationReport')}</CardTitle>
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
                        ) : result ? (
                            <div className="space-y-6">
                                {/* Score Overview */}
                                <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-full">
                                            <Target className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{t('conversionPotential')}</p>
                                            <p className="text-xs text-muted-foreground">Based on best practices</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-2xl font-bold ${result.conversionScore > 75 ? 'text-green-600' : result.conversionScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {result.conversionScore}/100
                                        </span>
                                    </div>
                                </div>

                                {/* Detailed Suggestions */}
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-2">{t('keyFindings')}</h4>
                                    {result.elements.map((item: any, index: number) => (
                                        <div key={index} className="border-l-4 rounded-r-lg border-l-transparent bg-background border p-4 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium text-sm flex items-center gap-2">
                                                    {item.type}
                                                </h5>
                                                <Badge variant={item.impact === 'High' || item.impact === 'Yüksek' ? 'default' : 'secondary'}>
                                                    {item.impact}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-foreground mb-1 font-medium">Suggestion: {item.suggestion}</p>
                                            <p className="text-xs text-muted-foreground">{item.observation}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* A/B Test Ideas */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 text-sm flex items-center gap-2">
                                        <MousePointerClick className="h-4 w-4" /> {t('abTestIdeas')}
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.abTestIdeas.map((idea: string, index: number) => (
                                            <li key={index} className="text-sm text-blue-600 dark:text-blue-400 flex items-start gap-2">
                                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-70" />
                                                {idea}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2 text-muted-foreground">
                                <TrendingUp className="h-10 w-10 opacity-20" />
                                <p>{t('uploadToAnalyze')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
