"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    ShoppingCart,
    Plane,
    HeartPulse,
    GraduationCap,
    Home,
    Landmark,
    UtensilsCrossed,
    Briefcase,
    Car,
    School
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"

export default function IndustriesPage() {
    const { language } = useLanguage()

    const industries = [
        {
            id: 'ecommerce',
            icon: ShoppingCart,
            color: 'lime',
            name: { en: 'E-commerce', tr: 'E-ticaret' },
            desc: {
                en: 'Product recommendations, stock alerts, cart recovery, discount codes',
                tr: 'Ürün önerileri, stok uyarıları, sepet kurtarma, indirim kodları'
            },
            example: {
                en: '"Only 3 left! Use code SAVE10 for 10% off"',
                tr: '"Sadece 3 adet kaldı! INDIRIM10 koduyla %10 indirim"'
            }
        },
        {
            id: 'travel',
            icon: Plane,
            color: 'blue',
            name: { en: 'Travel & Tourism', tr: 'Seyahat & Turizm' },
            desc: {
                en: 'Trip planning, luggage recommendations, insurance offers, booking assistance',
                tr: 'Gezi planlama, bagaj önerileri, sigorta teklifleri, rezervasyon yardımı'
            },
            example: {
                en: '"For your 5-day trip, I recommend travel insurance"',
                tr: '"5 günlük seyahatiniz için seyahat sigortası öneriyorum"'
            }
        },
        {
            id: 'healthcare',
            icon: HeartPulse,
            color: 'red',
            name: { en: 'Healthcare', tr: 'Sağlık' },
            desc: {
                en: 'Appointment scheduling, symptom guidance, department routing',
                tr: 'Randevu planlama, belirti rehberliği, bölüm yönlendirme'
            },
            example: {
                en: '"For headaches, I recommend our Neurology department"',
                tr: '"Baş ağrısı için Nöroloji bölümümüzü öneriyorum"'
            }
        },
        {
            id: 'education',
            icon: GraduationCap,
            color: 'amber',
            name: { en: 'Education', tr: 'Eğitim' },
            desc: {
                en: 'Course info, enrollment assistance, schedule management',
                tr: 'Kurs bilgisi, kayıt yardımı, program yönetimi'
            },
            example: {
                en: '"Our Python course starts next Monday"',
                tr: '"Python kursumuz önümüzdeki Pazartesi başlıyor"'
            }
        },
        {
            id: 'realestate',
            icon: Home,
            color: 'emerald',
            name: { en: 'Real Estate', tr: 'Emlak' },
            desc: {
                en: 'Property search, viewing appointments, price comparisons',
                tr: 'Mülk arama, görüntüleme randevuları, fiyat karşılaştırmaları'
            },
            example: {
                en: '"I found 3 apartments in your budget range"',
                tr: '"Bütçenize uygun 3 daire buldum"'
            }
        },
        {
            id: 'finance',
            icon: Landmark,
            color: 'indigo',
            name: { en: 'Finance & Banking', tr: 'Finans & Bankacılık' },
            desc: {
                en: 'Product comparison, loan calculations, account guidance',
                tr: 'Ürün karşılaştırma, kredi hesaplamaları, hesap rehberliği'
            },
            example: {
                en: '"Based on your needs, I recommend our savings account"',
                tr: '"İhtiyaçlarınıza göre tasarruf hesabımızı öneriyorum"'
            }
        },
        {
            id: 'restaurant',
            icon: UtensilsCrossed,
            color: 'orange',
            name: { en: 'Restaurant & Food', tr: 'Restoran & Yemek' },
            desc: {
                en: 'Menu info, reservations, dietary options, order tracking',
                tr: 'Menü bilgisi, rezervasyonlar, diyet seçenekleri, sipariş takibi'
            },
            example: {
                en: '"We have vegan options. Table for 4 at 7pm?"',
                tr: '"Vegan seçeneklerimiz var. 4 kişilik masa saat 19:00?"'
            }
        },
        {
            id: 'services',
            icon: Briefcase,
            color: 'purple',
            name: { en: 'Professional Services', tr: 'Profesyonel Hizmetler' },
            desc: {
                en: 'Quote requests, service explanations, booking',
                tr: 'Teklif talepleri, hizmet açıklamaları, randevu'
            },
            example: {
                en: '"For website design, our package starts at $999"',
                tr: '"Web sitesi tasarımı için paketimiz 999$\'dan başlıyor"'
            }
        },
        {
            id: 'automotive',
            icon: Car,
            color: 'cyan',
            name: { en: 'Automotive', tr: 'Otomotiv' },
            desc: {
                en: 'Test drive booking, vehicle comparison, service scheduling',
                tr: 'Test sürüşü randevusu, araç karşılaştırma, servis planlama'
            },
            example: {
                en: '"I can schedule a test drive for the Model X"',
                tr: '"Model X için test sürüşü ayarlayabilirim"'
            }
        },
        {
            id: 'academic',
            icon: School,
            color: 'pink',
            name: { en: 'Universities & Schools', tr: 'Üniversite & Okullar' },
            desc: {
                en: 'Admission info, campus tours, program guidance',
                tr: 'Kabul bilgisi, kampüs turları, program rehberliği'
            },
            example: {
                en: '"Application deadline for Fall 2025 is March 15"',
                tr: '"2025 Güz dönemi başvuru tarihi 15 Mart"'
            }
        }
    ]

    const colorClasses: Record<string, { bg: string, text: string, border: string }> = {
        lime: { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30' },
        blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
        red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
        amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
        emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
        indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
        orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
        purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
        cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
        pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
    }

    return (
        <div className="dark min-h-screen bg-black text-white font-sans">
            <PublicHeader />

            {/* Hero */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {language === 'tr' ? '10 Sektör, 10 Uzman AI' : '10 Industries, 10 Expert AIs'}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {language === 'tr'
                                ? 'Her sektöre özel davranış, terminoloji ve use case\'ler.'
                                : 'Industry-specific behavior, terminology, and use cases for each sector.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Industries Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industries.map((industry) => {
                            const colors = colorClasses[industry.color]
                            const Icon = industry.icon
                            return (
                                <div
                                    key={industry.id}
                                    className={`p-6 rounded-2xl bg-black/40 border border-white/5 hover:${colors.border} transition-all duration-300 group`}
                                >
                                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                                        <Icon className={`w-7 h-7 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {industry.name[language as 'en' | 'tr']}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {industry.desc[language as 'en' | 'tr']}
                                    </p>
                                    <div className={`text-xs ${colors.text} bg-white/5 rounded-lg p-3 italic`}>
                                        {industry.example[language as 'en' | 'tr']}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 rounded-3xl p-12">
                        <h2 className="text-3xl font-bold mb-4">
                            {language === 'tr' ? 'Sektörünüz listede yok mu?' : 'Your industry not listed?'}
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            {language === 'tr'
                                ? 'Özel sektör konfigürasyonu için bizimle iletişime geçin.'
                                : 'Contact us for custom industry configuration.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button className="h-12 px-8 bg-purple-600 hover:bg-purple-500 text-white">
                                    {language === 'tr' ? 'Ücretsiz Başla' : 'Start Free'}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/5">
                                    {language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    )
}
