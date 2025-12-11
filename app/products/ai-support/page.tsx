"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Globe,
    MessageSquare,
    Zap,
    Shield,
    BarChart3,
    Clock,
    Users,
    FileText,
    Palette,
    Code,
    Smartphone,
    Languages,
    Brain,
    HeartHandshake,
    Target,
    ChevronDown,
    ArrowLeft
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SupportedLanguage = 'en' | 'tr'

export default function AiSupportPage() {
    const [language, setLanguage] = useState<SupportedLanguage>('en')

    useEffect(() => {
        const storedLang = localStorage.getItem('language') as SupportedLanguage
        if (storedLang && ['en', 'tr'].includes(storedLang)) {
            setLanguage(storedLang)
        } else {
            const browserLang = navigator.language.split('-')[0] as SupportedLanguage
            if (['en', 'tr'].includes(browserLang)) {
                setLanguage(browserLang)
            }
        }
    }, [])

    const handleLanguageChange = (lang: SupportedLanguage) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    const languageLabels: Record<string, string> = {
        en: "English",
        tr: "Türkçe"
    }

    const content = {
        en: {
            backToHome: "Back to Home",
            heroTitle: "AI Customer Support That Never Sleeps",
            heroSubtitle: "Deploy an intelligent chatbot that learns from your data, speaks 50+ languages, and resolves 80% of customer queries instantly — 24/7, 365 days a year.",
            startFree: "Start Free Trial",
            watchDemo: "Watch Demo",
            trustedBy: "Trusted by innovative companies worldwide",

            // Features section
            featuresTitle: "Everything You Need for Exceptional Customer Support",
            featuresSubtitle: "Our AI chatbot is packed with powerful features designed to delight your customers and save your team hours every day.",

            // Feature items
            feature1Title: "24/7 Instant Responses",
            feature1Desc: "Your customers get immediate answers any time of day or night. No more waiting in queues or delayed responses.",

            feature2Title: "Learns From Your Data",
            feature2Desc: "Train your bot with documents, URLs, Q&As, and files. It continuously learns and improves from every conversation.",

            feature3Title: "50+ Languages",
            feature3Desc: "Automatically detect and respond in your customer's language. Break down language barriers effortlessly.",

            feature4Title: "Lead Generation",
            feature4Desc: "Capture visitor information and qualify leads automatically. Never miss a potential customer again.",

            feature5Title: "Human Handoff",
            feature5Desc: "Seamlessly transfer complex queries to human agents when needed, with full conversation context.",

            feature6Title: "Custom Branding",
            feature6Desc: "Match your brand identity with customizable colors, logos, and widget styles. White-label ready.",

            feature7Title: "Easy Integration",
            feature7Desc: "Add to any website with a simple script tag. Works with WordPress, Shopify, and all major platforms.",

            feature8Title: "Analytics Dashboard",
            feature8Desc: "Track conversations, response times, customer satisfaction, and identify improvement opportunities.",

            feature9Title: "Mobile Optimized",
            feature9Desc: "Perfect experience on any device. Responsive design that adapts to smartphones, tablets, and desktops.",

            // How it works
            howItWorksTitle: "Get Started in 3 Simple Steps",
            step1Title: "1. Train Your Bot",
            step1Desc: "Upload your documents, paste URLs, or add Q&A pairs. Our AI learns everything about your business in minutes.",
            step2Title: "2. Customize & Brand",
            step2Desc: "Match your brand colors, add your logo, and configure the widget behavior to fit your needs perfectly.",
            step3Title: "3. Deploy & Grow",
            step3Desc: "Copy one line of code to your website. Watch as your AI handles thousands of conversations effortlessly.",

            // Use cases
            useCasesTitle: "Perfect For Every Industry",
            useCase1: "E-commerce",
            useCase1Desc: "Answer product questions, track orders, handle returns",
            useCase2: "SaaS",
            useCase2Desc: "Onboard users, troubleshoot issues, upsell features",
            useCase3: "Healthcare",
            useCase3Desc: "Schedule appointments, answer FAQs, provide info",
            useCase4: "Education",
            useCase4Desc: "Support students, answer course questions, guide admissions",
            useCase5: "Finance",
            useCase5Desc: "Explain services, collect leads, schedule consultations",
            useCase6: "Real Estate",
            useCase6Desc: "Qualify leads, schedule viewings, answer property questions",

            // CTA
            ctaTitle: "Ready to Transform Your Customer Support?",
            ctaSubtitle: "Join thousands of businesses using Userex AI to deliver exceptional customer experiences.",
            ctaButton: "Start Your Free Trial",
            noCreditCard: "No credit card required • 14-day free trial • Cancel anytime",

            // Footer
            privacy: "Privacy",
            terms: "Terms",
            contact: "Contact",
            allRights: "All rights reserved."
        },
        tr: {
            backToHome: "Ana Sayfaya Dön",
            heroTitle: "Hiç Uyumayan AI Müşteri Desteği",
            heroSubtitle: "Verilerinizden öğrenen, 50+ dil konuşan ve müşteri sorgularının %80'ini anında çözen akıllı bir chatbot dağıtın — 7/24, yılın 365 günü.",
            startFree: "Ücretsiz Deneyin",
            watchDemo: "Demo İzle",
            trustedBy: "Dünya çapında yenilikçi şirketler tarafından güveniliyor",

            // Features section
            featuresTitle: "Olağanüstü Müşteri Desteği İçin İhtiyacınız Olan Her Şey",
            featuresSubtitle: "AI chatbotumuz, müşterilerinizi memnun etmek ve ekibinize her gün saatler kazandırmak için tasarlanmış güçlü özelliklerle donatılmıştır.",

            // Feature items
            feature1Title: "7/24 Anında Yanıtlar",
            feature1Desc: "Müşterileriniz günün veya gecenin herhangi bir saatinde anında cevap alır. Artık kuyrukta bekleme veya gecikmeli yanıtlar yok.",

            feature2Title: "Verilerinizden Öğrenir",
            feature2Desc: "Botunuzu belgeler, URL'ler, Soru-Cevaplar ve dosyalarla eğitin. Her konuşmadan sürekli öğrenir ve gelişir.",

            feature3Title: "50+ Dil Desteği",
            feature3Desc: "Müşterinizin dilini otomatik olarak algılayın ve yanıt verin. Dil engellerini zahmetsizce aşın.",

            feature4Title: "Lead Oluşturma",
            feature4Desc: "Ziyaretçi bilgilerini yakalayın ve leadleri otomatik olarak nitelendirin. Potansiyel müşteriyi asla kaçırmayın.",

            feature5Title: "İnsan Temsilciye Aktarım",
            feature5Desc: "Karmaşık sorguları gerektiğinde tam konuşma bağlamıyla insan temsilcilere sorunsuzca aktarın.",

            feature6Title: "Özel Markalama",
            feature6Desc: "Özelleştirilebilir renkler, logolar ve widget stilleriyle marka kimliğinizi eşleştirin. White-label hazır.",

            feature7Title: "Kolay Entegrasyon",
            feature7Desc: "Basit bir script etiketiyle herhangi bir web sitesine ekleyin. WordPress, Shopify ve tüm büyük platformlarla çalışır.",

            feature8Title: "Analitik Paneli",
            feature8Desc: "Konuşmaları, yanıt sürelerini, müşteri memnuniyetini takip edin ve iyileştirme fırsatlarını belirleyin.",

            feature9Title: "Mobil Optimize",
            feature9Desc: "Her cihazda mükemmel deneyim. Akıllı telefonlara, tabletlere ve masaüstüne uyum sağlayan duyarlı tasarım.",

            // How it works
            howItWorksTitle: "3 Basit Adımda Başlayın",
            step1Title: "1. Botunuzu Eğitin",
            step1Desc: "Belgelerinizi yükleyin, URL'leri yapıştırın veya Soru-Cevap çiftleri ekleyin. AI'mız dakikalar içinde işletmeniz hakkında her şeyi öğrenir.",
            step2Title: "2. Özelleştirin & Markalaştırın",
            step2Desc: "Marka renklerinizi eşleştirin, logonuzu ekleyin ve widget davranışını ihtiyaçlarınıza göre yapılandırın.",
            step3Title: "3. Dağıtın & Büyüyün",
            step3Desc: "Web sitenize tek satır kod kopyalayın. AI'nızın binlerce konuşmayı zahmetsizce yönetmesini izleyin.",

            // Use cases
            useCasesTitle: "Her Sektör İçin Mükemmel",
            useCase1: "E-ticaret",
            useCase1Desc: "Ürün sorularını yanıtlayın, siparişleri takip edin, iadeleri yönetin",
            useCase2: "SaaS",
            useCase2Desc: "Kullanıcıları onboard edin, sorunları giderin, özellikleri upsell yapın",
            useCase3: "Sağlık",
            useCase3Desc: "Randevu planlayın, SSS'leri yanıtlayın, bilgi sağlayın",
            useCase4: "Eğitim",
            useCase4Desc: "Öğrencileri destekleyin, ders sorularını yanıtlayın, kayıtları yönlendirin",
            useCase5: "Finans",
            useCase5Desc: "Hizmetleri açıklayın, lead toplayın, danışmanlık planlayın",
            useCase6: "Gayrimenkul",
            useCase6Desc: "Leadleri nitelendirin, görüntülemeleri planlayın, mülk sorularını yanıtlayın",

            // CTA
            ctaTitle: "Müşteri Desteğinizi Dönüştürmeye Hazır mısınız?",
            ctaSubtitle: "Olağanüstü müşteri deneyimleri sunmak için Userex AI kullanan binlerce işletmeye katılın.",
            ctaButton: "Ücretsiz Denemenizi Başlatın",
            noCreditCard: "Kredi kartı gerekmez • 14 günlük ücretsiz deneme • İstediğiniz zaman iptal edin",

            // Footer
            privacy: "Gizlilik",
            terms: "Şartlar",
            contact: "İletişim",
            allRights: "Tüm hakları saklıdır."
        }
    }

    const t = content[language]

    const features = [
        { icon: Clock, title: t.feature1Title, desc: t.feature1Desc, color: "lime" },
        { icon: Brain, title: t.feature2Title, desc: t.feature2Desc, color: "purple" },
        { icon: Languages, title: t.feature3Title, desc: t.feature3Desc, color: "blue" },
        { icon: Target, title: t.feature4Title, desc: t.feature4Desc, color: "green" },
        { icon: HeartHandshake, title: t.feature5Title, desc: t.feature5Desc, color: "pink" },
        { icon: Palette, title: t.feature6Title, desc: t.feature6Desc, color: "orange" },
        { icon: Code, title: t.feature7Title, desc: t.feature7Desc, color: "cyan" },
        { icon: BarChart3, title: t.feature8Title, desc: t.feature8Desc, color: "yellow" },
        { icon: Smartphone, title: t.feature9Title, desc: t.feature9Desc, color: "rose" },
    ]

    const useCases = [
        { icon: "🛒", title: t.useCase1, desc: t.useCase1Desc },
        { icon: "💻", title: t.useCase2, desc: t.useCase2Desc },
        { icon: "🏥", title: t.useCase3, desc: t.useCase3Desc },
        { icon: "🎓", title: t.useCase4, desc: t.useCase4Desc },
        { icon: "💰", title: t.useCase5, desc: t.useCase5Desc },
        { icon: "🏠", title: t.useCase6, desc: t.useCase6Desc },
    ]

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-lime-500/20 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            {t.backToHome}
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Image
                            src="/exai-logo.png"
                            alt="ex ai"
                            width={100}
                            height={24}
                            className="h-6 w-auto object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 gap-1">
                                    <Globe className="w-4 h-4" />
                                    {languageLabels[language]}
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-black border-white/10">
                                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="text-white hover:bg-white/10 cursor-pointer">
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleLanguageChange('tr')} className="text-white hover:bg-white/10 cursor-pointer">
                                    Türkçe
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/signup">
                            <Button className="bg-lime-600 text-white hover:bg-lime-500 font-medium">
                                {t.startFree}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/30 via-black to-black pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-lime-500/15 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/30">
                            <Bot className="w-6 h-6 text-lime-400" />
                            <span className="text-lime-400 font-medium">AI Customer Support</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 pb-2">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {t.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/signup">
                                <Button className="h-14 px-10 text-lg bg-lime-600 hover:bg-lime-500 text-white shadow-lg shadow-lime-500/25 transition-all hover:scale-105">
                                    {t.startFree}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {t.featuresTitle}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t.featuresSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
                                <div className="relative z-10 space-y-4">
                                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center`}>
                                        <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                                    </div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorksTitle}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-lime-500/20 flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-lime-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step1Title}</h3>
                            <p className="text-muted-foreground">{t.step1Desc}</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                                <Palette className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step2Title}</h3>
                            <p className="text-muted-foreground">{t.step2Desc}</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                                <Zap className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step3Title}</h3>
                            <p className="text-muted-foreground">{t.step3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold">{t.useCasesTitle}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {useCases.map((useCase, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-4xl mb-4">{useCase.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                                <p className="text-muted-foreground text-sm">{useCase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-lime-900/30 to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {t.ctaTitle}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t.ctaSubtitle}
                        </p>
                        <Link href="/signup">
                            <Button className="h-14 px-10 text-lg bg-lime-600 hover:bg-lime-500 text-white shadow-xl shadow-lime-500/20 transition-all hover:scale-105">
                                {t.ctaButton}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-6">{t.noCreditCard}</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 bg-black">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Image
                                src="/exai-logo.png"
                                alt="ex ai"
                                width={100}
                                height={28}
                                className="h-6 w-auto object-contain"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2024 ex ai by Userex. {t.allRights}
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-white transition-colors">{t.privacy}</Link>
                            <Link href="#" className="hover:text-white transition-colors">{t.terms}</Link>
                            <Link href="#" className="hover:text-white transition-colors">{t.contact}</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
