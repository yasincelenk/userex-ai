"use client"

import { useState } from "react"
import { UploadZone } from "@/components/ui-ux-auditor/upload-zone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function HeuristicEvalPage() {
    const { t, language } = useLanguage()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [evalResult, setEvalResult] = useState<any>(null)
    const [expandedItem, setExpandedItem] = useState<string | null>(null)

    const handleFileSelect = async (file: File) => {
        setIsAnalyzing(true)
        setEvalResult(null)
        // Simulate AI Analysis
        setTimeout(() => {
            setIsAnalyzing(false)
            if (language === 'tr') {
                setEvalResult({
                    overallScore: 68,
                    heuristics: [
                        {
                            id: "visibility",
                            title: "1. Sistem Durumunun Görünürlüğü",
                            score: 85,
                            status: "excellent",
                            comment: "Geri bildirimler genel olarak iyi, ancak büyük işlemlerde yükleme durumları eksik."
                        },
                        {
                            id: "match",
                            title: "2. Sistem ve Gerçek Dünya Arasındaki Uyum",
                            score: 90,
                            status: "excellent",
                            comment: "Dil ve ikonlar kullanıcıya tanıdık ve doğal geliyor."
                        },
                        {
                            id: "control",
                            title: "3. Kullanıcı Kontrolü ve Özgürlüğü",
                            score: 60,
                            status: "poor",
                            comment: "Ödeme akışında 'Geri Al' veya 'Geri Dön' seçenekleri yok."
                        },
                        {
                            id: "consistency",
                            title: "4. Tutarlılık ve Standartlar",
                            score: 75,
                            status: "average",
                            comment: "Düğme stilleri farklı sayfalarda değişiklik gösteriyor."
                        },
                        {
                            id: "error-prevention",
                            title: "5. Hata Önleme",
                            score: 70,
                            status: "average",
                            comment: "Silme işlemleri için onay iletişim kutuları mevcut, ancak iptaller için yok."
                        },
                        {
                            id: "recall",
                            title: "6. Hatırlamadan Çok Tanıma",
                            score: 80,
                            status: "good",
                            comment: "Menüler görünür, ancak arama geçmişi iyileştirilebilir."
                        },
                        {
                            id: "flexibility",
                            title: "7. Esneklik ve Kullanım Verimliliği",
                            score: 55,
                            status: "poor",
                            comment: "Güçlü kullanıcılar için klavye kısayolları veya gelişmiş filtreler yok."
                        },
                        {
                            id: "aesthetic",
                            title: "8. Estetik ve Minimalist Tasarım",
                            score: 95,
                            status: "excellent",
                            comment: "Arayüz temiz, karmaşadan uzak ve içeriğe odaklı."
                        },
                        {
                            id: "recover",
                            title: "9. Kullanıcıların Hataları Tanımasına Yardımcı Olma",
                            score: 65,
                            status: "average",
                            comment: "Hata mesajları genel; belirli çözümler sunulmalı."
                        },
                        {
                            id: "help",
                            title: "10. Yardım ve Dokümantasyon",
                            score: 40,
                            status: "poor",
                            comment: "Karmaşık formlarda yardım merkezi veya araç ipucu yardımcıları bulunamadı."
                        }
                    ]
                })
            } else if (language === 'de') {
                setEvalResult({
                    overallScore: 68,
                    heuristics: [
                        {
                            id: "visibility",
                            title: "1. Sichtbarkeit des Systemstatus",
                            score: 85,
                            status: "excellent",
                            comment: "Rückmeldungen sind im Allgemeinen gut, aber Ladestatus bei großen Aktionen fehlen."
                        },
                        {
                            id: "match",
                            title: "2. Übereinstimmung zwischen System und realer Welt",
                            score: 90,
                            status: "excellent",
                            comment: "Sprache und Symbole sind dem Benutzer vertraut und natürlich."
                        },
                        {
                            id: "control",
                            title: "3. Benutzerkontrolle und Freiheit",
                            score: 60,
                            status: "poor",
                            comment: "Fehlende Optionen 'Rückgängig' oder 'Zurück' im Checkout-Prozess."
                        },
                        {
                            id: "consistency",
                            title: "4. Konsistenz und Standards",
                            score: 75,
                            status: "average",
                            comment: "Schaltflächenstile variieren auf verschiedenen Seiten."
                        },
                        {
                            id: "error-prevention",
                            title: "5. Fehlervermeidung",
                            score: 70,
                            status: "average",
                            comment: "Bestätigungsdialoge sind für Löschaktionen vorhanden, jedoch nicht für Verwerfungen."
                        },
                        {
                            id: "recall",
                            title: "6. Wiedererkennen statt Erinnern",
                            score: 80,
                            status: "good",
                            comment: "Menüs sind sichtbar, aber der Suchverlauf könnte verbessert werden."
                        },
                        {
                            id: "flexibility",
                            title: "7. Flexibilität und Effizienz der Nutzung",
                            score: 55,
                            status: "poor",
                            comment: "Keine Tastaturkürzel oder erweiterte Filter für Power-User."
                        },
                        {
                            id: "aesthetic",
                            title: "8. Ästhetisches und minimalistisches Design",
                            score: 95,
                            status: "excellent",
                            comment: "Die Benutzeroberfläche ist sauber, aufgeräumt und konzentriert sich auf den Inhalt."
                        },
                        {
                            id: "recover",
                            title: "9. Benutzern helfen, Fehler zu erkennen",
                            score: 65,
                            status: "average",
                            comment: "Fehlermeldungen sind allgemein; spezifische Lösungen sollten angeboten werden."
                        },
                        {
                            id: "help",
                            title: "10. Hilfe und Dokumentation",
                            score: 40,
                            status: "poor",
                            comment: "Kein Hilfezentrum oder Tooltip-Helfer in komplexen Formularen gefunden."
                        }
                    ]
                })
            } else if (language === 'es') {
                setEvalResult({
                    overallScore: 68,
                    heuristics: [
                        {
                            id: "visibility",
                            title: "1. Visibilidad del estado del sistema",
                            score: 85,
                            status: "excellent",
                            comment: "La retroalimentación es buena en general, pero faltan estados de carga en acciones grandes."
                        },
                        {
                            id: "match",
                            title: "2. Coincidencia entre el sistema y el mundo real",
                            score: 90,
                            status: "excellent",
                            comment: "El lenguaje y los iconos son familiares y naturales para el usuario."
                        },
                        {
                            id: "control",
                            title: "3. Control y libertad del usuario",
                            score: 60,
                            status: "poor",
                            comment: "Falta de opciones 'Deshacer' o 'Volver' en el flujo de pago."
                        },
                        {
                            id: "consistency",
                            title: "4. Consistencia y estándares",
                            score: 75,
                            status: "average",
                            comment: "Los estilos de botones varían en diferentes páginas."
                        },
                        {
                            id: "error-prevention",
                            title: "5. Prevención de errores",
                            score: 70,
                            status: "average",
                            comment: "Los diálogos de confirmación están presentes para acciones de eliminación, pero no para descartes."
                        },
                        {
                            id: "recall",
                            title: "6. Reconocimiento en lugar de recordar",
                            score: 80,
                            status: "good",
                            comment: "Los menús son visibles, pero el historial de búsqueda podría mejorarse."
                        },
                        {
                            id: "flexibility",
                            title: "7. Flexibilidad y eficiencia de uso",
                            score: 55,
                            status: "poor",
                            comment: "No hay atajos de teclado ni filtros avanzados para usuarios expertos."
                        },
                        {
                            id: "aesthetic",
                            title: "8. Diseño estético y minimalista",
                            score: 95,
                            status: "excellent",
                            comment: "La interfaz es limpia, sin desorden y se centra en el contenido."
                        },
                        {
                            id: "recover",
                            title: "9. Ayudar a los usuarios a reconocer errores",
                            score: 65,
                            status: "average",
                            comment: "Los mensajes de error son genéricos; proporcione soluciones específicas."
                        },
                        {
                            id: "help",
                            title: "10. Ayuda y documentación",
                            score: 40,
                            status: "poor",
                            comment: "No se encontró centro de ayuda ni ayudas emergentes en formularios complejos."
                        }
                    ]
                })
            } else {
                setEvalResult({
                    overallScore: 68,
                    heuristics: [
                        {
                            id: "visibility",
                            title: "1. Visibility of System Status",
                            score: 85,
                            status: "good",
                            comment: "Feedback is generally good, but loading states on large actions are missing."
                        },
                        {
                            id: "match",
                            title: "2. Match Between System and Real World",
                            score: 90,
                            status: "excellent",
                            comment: "Language and icons are familiar and natural to the user."
                        },
                        {
                            id: "control",
                            title: "3. User Control and Freedom",
                            score: 60,
                            status: "poor",
                            comment: "Lack of 'Undo' or 'Go Back' options in the checkout flow."
                        },
                        {
                            id: "consistency",
                            title: "4. Consistency and Standards",
                            score: 75,
                            status: "average",
                            comment: "Button styles vary across different pages."
                        },
                        {
                            id: "error-prevention",
                            title: "5. Error Prevention",
                            score: 70,
                            status: "average",
                            comment: "Confirmation dialogs are present for delete actions, but not for discards."
                        },
                        {
                            id: "recall",
                            title: "6. Recognition Rather Than Recall",
                            score: 80,
                            status: "good",
                            comment: "Menus are visible, but search history could be improved."
                        },
                        {
                            id: "flexibility",
                            title: "7. Flexibility and Efficiency of Use",
                            score: 55,
                            status: "poor",
                            comment: "No keyboard shortcuts or advanced filters for power users."
                        },
                        {
                            id: "aesthetic",
                            title: "8. Aesthetic and Minimalist Design",
                            score: 95,
                            status: "excellent",
                            comment: "Interface is clean, clutter-free, and focuses on content."
                        },
                        {
                            id: "recover",
                            title: "9. Help Users Recognize Errors",
                            score: 65,
                            status: "average",
                            comment: "Error messages are generic; provide specific solutions."
                        },
                        {
                            id: "help",
                            title: "10. Help and Documentation",
                            score: 40,
                            status: "poor",
                            comment: "No help center or tooltip helpers found in complex forms."
                        }
                    ]
                })
            }
        }, 3000)
    }

    const toggleExpand = (id: string) => {
        setExpandedItem(expandedItem === id ? null : id)
    }

    return (
        <div className="flex flex-col h-full p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('heuristicTitle')}</h2>
                    <p className="text-muted-foreground">
                        {t('heuristicDesc')}
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
                        <CardTitle>{t('evaluationScorecard')}</CardTitle>
                        <CardDescription>
                            Detailed breakdown of usability issues.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Evaluating against 10 heuristics...</p>
                            </div>
                        ) : evalResult ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <span className="font-semibold text-lg">{t('overallScore')}</span>
                                    <span className={`text-3xl font-bold ${evalResult.overallScore < 50 ? 'text-red-500' : evalResult.overallScore < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {evalResult.overallScore}/100
                                    </span>
                                </div>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {evalResult.heuristics.map((item: any) => (
                                        <div key={item.id} className="border rounded-lg p-3 space-y-2">
                                            <div
                                                className="flex items-center justify-between cursor-pointer"
                                                onClick={() => toggleExpand(item.id)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="font-medium text-sm">{item.title}</h4>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize
                                                            ${item.status === 'excellent' ? 'bg-green-100 text-green-700' :
                                                                item.status === 'good' ? 'bg-blue-100 text-blue-700' :
                                                                    item.status === 'average' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'}`}>
                                                            {item.score}/100
                                                        </span>
                                                    </div>
                                                    <Progress value={item.score} className="h-2" />
                                                </div>
                                                <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                                                    {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </div>

                                            {expandedItem === item.id && (
                                                <div className="pt-2 text-sm text-muted-foreground animate-in slide-in-from-top-2">
                                                    {item.comment}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full" variant="outline">Export PDF Report</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2 text-muted-foreground">
                                <CheckCircle2 className="h-10 w-10 opacity-20" />
                                <p>{t('uploadToAnalyze')}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
