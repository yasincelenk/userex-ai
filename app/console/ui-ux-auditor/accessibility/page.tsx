"use client"

import { useState } from "react"
import { ScanInterface } from "@/components/ui-ux-auditor/scan-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function AccessibilityAuditPage() {
    const { t, language } = useLanguage()
    const [isScanning, setIsScanning] = useState(false)
    const [auditResult, setAuditResult] = useState<any>(null)

    const handleScan = async (url: string) => {
        setIsScanning(true)
        setAuditResult(null)

        // Simulate API call
        setTimeout(() => {
            setIsScanning(false)
            if (language === 'tr') {
                setAuditResult({
                    score: 85,
                    url: url,
                    timestamp: new Date().toLocaleString(),
                    issues: {
                        critical: 2,
                        moderate: 5,
                        minor: 8
                    },
                    details: [
                        {
                            id: "contrast",
                            status: "fail",
                            title: "Düşük Kontrast",
                            description: "Metin öğeleri arka plana karşı yeterli renk kontrastına sahip olmalıdır.",
                            impact: "kritik"
                        },
                        {
                            id: "alt-text",
                            status: "pass",
                            title: "Resim Alt Metni",
                            description: "Tüm resimlerin uygun alternatif metni var.",
                            impact: "kritik"
                        },
                        {
                            id: "heading-order",
                            status: "warning",
                            title: "Başlık Yapısı",
                            description: "Başlık seviyeleri sadece birer birer artmalıdır.",
                            impact: "orta"
                        }
                    ]
                })
            } else if (language === 'de') {
                setAuditResult({
                    score: 85,
                    url: url,
                    timestamp: new Date().toLocaleString(),
                    issues: {
                        critical: 2,
                        moderate: 5,
                        minor: 8
                    },
                    details: [
                        {
                            id: "contrast",
                            status: "fail",
                            title: "Geringer Kontrast",
                            description: "Textelemente müssen einen ausreichenden Farbkontrast zum Hintergrund haben.",
                            impact: "kritisch"
                        },
                        {
                            id: "alt-text",
                            status: "pass",
                            title: "Bild-Alt-Text",
                            description: "Alle Bilder haben geeignete Alternativtexte.",
                            impact: "kritisch"
                        },
                        {
                            id: "heading-order",
                            status: "warning",
                            title: "Überschriftenstruktur",
                            description: "Überschriftenebenen sollten nur um eins ansteigen.",
                            impact: "mittel"
                        }
                    ]
                })
            } else if (language === 'es') {
                setAuditResult({
                    score: 85,
                    url: url,
                    timestamp: new Date().toLocaleString(),
                    issues: {
                        critical: 2,
                        moderate: 5,
                        minor: 8
                    },
                    details: [
                        {
                            id: "contrast",
                            status: "fail",
                            title: "Bajo contraste",
                            description: "Los elementos de texto deben tener suficiente contraste de color con el fondo.",
                            impact: "crítico"
                        },
                        {
                            id: "alt-text",
                            status: "pass",
                            title: "Texto alternativo de imagen",
                            description: "Todas las imágenes tienen texto alternativo apropiado.",
                            impact: "crítico"
                        },
                        {
                            id: "heading-order",
                            status: "warning",
                            title: "Estructura de encabezados",
                            description: "Los niveles de encabezado solo deben aumentar en uno.",
                            impact: "moderado"
                        }
                    ]
                })
            } else {
                setAuditResult({
                    score: 85,
                    url: url,
                    timestamp: new Date().toLocaleString(),
                    issues: {
                        critical: 2,
                        moderate: 5,
                        minor: 8
                    },
                    details: [
                        {
                            id: "contrast",
                            status: "fail",
                            title: "Low Contrast",
                            description: "Text elements must have sufficient color contrast against the background.",
                            impact: "critical"
                        },
                        {
                            id: "alt-text",
                            status: "pass",
                            title: "Image Alt Text",
                            description: "All images have appropriate alternative text.",
                            impact: "critical"
                        },
                        {
                            id: "heading-order",
                            status: "warning",
                            title: "Heading Structure",
                            description: "Heading levels should only increase by one.",
                            impact: "moderate"
                        }
                    ]
                })
            }
        }, 2500)
    }

    return (
        <div className="flex flex-col h-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('accessibilityTitle')}</h2>
                    <p className="text-muted-foreground">
                        {t('accessibilityDesc')}
                    </p>
                </div>
            </div>

            <ScanInterface onScan={handleScan} isScanning={isScanning} />

            {auditResult && (
                <div className="space-y-6 animate-in fade-in-50 duration-500">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('overallScore')}</CardTitle>
                                <CheckCircle2 className={`h-4 w-4 ${auditResult.score >= 90 ? 'text-green-500' : 'text-yellow-500'}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{auditResult.score}/100</div>
                                <Progress value={auditResult.score} className="mt-2" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('criticalIssues')}</CardTitle>
                                <XCircle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-500">{auditResult.issues.critical}</div>
                                <p className="text-xs text-muted-foreground">Immediate attention required</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('moderateIssues')}</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-500">{auditResult.issues.moderate}</div>
                                <p className="text-xs text-muted-foreground">Should be fixed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('passedChecks')}</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">24</div>
                                <p className="text-xs text-muted-foreground">Tests passed successfully</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Report</CardTitle>
                            <CardDescription>
                                Audit results for {auditResult.url} generated on {auditResult.timestamp}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {auditResult.details.map((item: any, index: number) => (
                                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                                        <div className="mt-1">
                                            {item.status === 'fail' && <XCircle className="h-5 w-5 text-red-500" />}
                                            {item.status === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                                            {item.status === 'pass' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{item.title}</h4>
                                                <Badge variant={item.status === 'fail' ? 'destructive' : item.status === 'warning' ? 'secondary' : 'outline'}>
                                                    {item.impact}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
