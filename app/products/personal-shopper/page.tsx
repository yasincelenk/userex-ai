"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    ShoppingBag,
    CheckCircle2,
    Search,
    TrendingUp,
    Smartphone,
    Share2,
    Tags,
    Zap,
    Home,
    ChevronRight,
    Store,
    LayoutGrid,
    MessageSquare,
    BarChart3
} from "lucide-react"

import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"

type SupportedLanguage = 'en' | 'tr'

export default function PersonalShopperPage() {
    const { language: globalLanguage } = useLanguage()
    // Cast strict type or fallback
    const language = (globalLanguage === 'tr' ? 'tr' : 'en') as SupportedLanguage

    const content = {
        en: {
            backToHome: "Back to Home",
            heroTitle: "Your AI Personal Shopper & Sales Expert",
            heroSubtitle: "Transform your e-commerce store with an AI that understands style, recommends features, and closes sales 24/7.",
            startFree: "Start Free Trial",
            watchDemo: "Watch Demo",

            // Features section
            featuresTitle: "Drive More Sales with Intelligent Recommendations",
            featuresSubtitle: "Turn visitors into buyers with an AI that acts like your best in-store sales associate.",

            // Feature items
            feature1Title: "Product Catalog Integration",
            feature1Desc: "Seamlessly sync your products. The AI knows your inventory, prices, and variants instantly.",

            feature2Title: "Smart Recommendations",
            feature2Desc: "Suggests the perfect products based on user preferences, budget, and style.",

            feature3Title: "Visual Product Cards",
            feature3Desc: "Displays products in attractive cards within the chat. Users can click to buy content immediately.",

            feature4Title: "Upselling & Cross-selling",
            feature4Desc: "Automatically suggests complementary items (e.g., 'This bag goes great with those shoes') to increase average order value.",

            feature5Title: "Social Sharing",
            feature5Desc: "Users can share product cards directly from the chat to WhatsApp or Social Media.",

            feature6Title: "Abandoned Cart Recovery",
            feature6Desc: "Engage users who are hesitant. Offer personalized discounts or answer last-minute questions to save the sale.",

            feature7Title: "Order Tracking",
            feature7Desc: "Allow customers to check their order status directly within the chat interface.",

            feature8Title: "Multi-Platform",
            feature8Desc: "Deploy your sales agent on your Website, WhatsApp, and Social Media channels.",

            feature9Title: "Sales Analytics",
            feature9Desc: "Track which products are being recommended and clicked most often.",

            // How it works
            howItWorksTitle: "Turn Browsers into Buyers",
            step1Title: "1. Connect Catalog",
            step1Desc: "Sync your Shopify, WooCommerce, or custom feed in seconds.",
            step2Title: "2. Define Strategy",
            step2Desc: "Set your sales tone (Aggressive, Helpful, Luxury) and recommendation logic.",
            step3Title: "3. Start Selling",
            step3Desc: "The AI engages visitors, guides them to products, and boosts your conversion rate.",

            // CTA
            ctaTitle: "Ready to Boost Your E-commerce Sales?",
            ctaSubtitle: "Join top brands using exAi to deliver personalized shopping experiences at scale.",
            ctaButton: "Create Your Store Bot",
            noCreditCard: "No credit card required • 14-day free trial",
        },
        tr: {
            backToHome: "Ana Sayfaya Dön",
            heroTitle: "AI Kişisel Alışveriş Asistanınız & Satış Uzmanınız",
            heroSubtitle: "E-ticaret mağazanızı; tarzı anlayan, özellik öneren ve 7/24 satış kapatan bir AI ile dönüştürün.",
            startFree: "Ücretsiz Deneyin",
            watchDemo: "Demo İzle",

            // Features section
            featuresTitle: "Akıllı Önerilerle Daha Fazla Satış Yapın",
            featuresSubtitle: "Ziyaretçilerinizi, mağazanızdaki en iyi satış danışmanı gibi davranan bir AI ile alıcılara dönüştürün.",

            // Feature items
            feature1Title: "Ürün Kataloğu Entegrasyonu",
            feature1Desc: "Ürünlerinizi sorunsuz bir şekilde senkronize edin. AI, envanterinizi, fiyatlarınızı ve varyasyonlarınızı anında bilir.",

            feature2Title: "Akıllı Öneriler",
            feature2Desc: "Kullanıcı tercihlerine, bütçesine ve tarzına göre mükemmel ürünleri önerir.",

            feature3Title: "Görsel Ürün Kartları",
            feature3Desc: "Ürünleri sohbet içinde çekici kartlarla gösterir. Kullanıcılar hemen satın almak için tıklayabilir.",

            feature4Title: "Upselling & Çapraz Satış",
            feature4Desc: "Ortalama sipariş değerini artırmak için tamamlayıcı ürünleri (örn. 'Bu çanta o ayakkabılarla harika gider') otomatik olarak önerir.",

            feature5Title: "Sosyal Paylaşım",
            feature5Desc: "Kullanıcılar ürün kartlarını doğrudan sohbetten WhatsApp veya Sosyal Medya'da paylaşabilir.",

            feature6Title: "Terk Edilmiş Sepet Kurtarma",
            feature6Desc: "Kararsız kalan kullanıcılarla etkileşime geçin. Satışı kurtarmak için kişisel indirimler sunun veya son dakika sorularını yanıtlayın.",

            feature7Title: "Sipariş Takibi",
            feature7Desc: "Müşterilerin sipariş durumlarını doğrudan sohbet arayüzünden kontrol etmelerine izin verin.",

            feature8Title: "Çoklu Platform",
            feature8Desc: "Satış temsilcinizi Web Sitenizde, WhatsApp'ta ve Sosyal Medya kanallarınızda dağıtın.",

            feature9Title: "Satış Analitiği",
            feature9Desc: "Hangi ürünlerin en sık önerildiğini ve tıklandığını takip edin.",

            // How it works
            howItWorksTitle: "Ziyaretçileri Müşteriye Dönüştürün",
            step1Title: "1. Kataloğu Bağla",
            step1Desc: "Shopify, WooCommerce veya özel akışınızı saniyeler içinde senkronize edin.",
            step2Title: "2. Stratejiyi Belirle",
            step2Desc: "Satış tonunuzu (Agresif, Yardımsever, Lüks) ve öneri mantığınızı ayarlayın.",
            step3Title: "3. Satışa Başla",
            step3Desc: "AI ziyaretçilerle etkileşime geçer, onları ürünlere yönlendirir ve dönüşüm oranınızı artırır.",

            // CTA
            ctaTitle: "E-ticaret Satışlarınızı Artırmaya Hazır mısınız?",
            ctaSubtitle: "Ölçeklenebilir kişiselleştirilmiş alışveriş deneyimleri sunmak için exAi kullanan lider markalara katılın.",
            ctaButton: "Mağaza Botunuzu Oluşturun",
            noCreditCard: "Kredi kartı gerekmez • 14 günlük ücretsiz deneme",
        }
    }

    const t = content[language]

    const features = [
        { icon: Store, title: t.feature1Title, desc: t.feature1Desc, bgClass: "bg-purple-500/20", iconClass: "text-purple-400" },
        { icon: Zap, title: t.feature2Title, desc: t.feature2Desc, bgClass: "bg-yellow-500/20", iconClass: "text-yellow-400" },
        { icon: LayoutGrid, title: t.feature3Title, desc: t.feature3Desc, bgClass: "bg-blue-500/20", iconClass: "text-blue-400" },
        { icon: TrendingUp, title: t.feature4Title, desc: t.feature4Desc, bgClass: "bg-green-500/20", iconClass: "text-green-400" },
        { icon: Share2, title: t.feature5Title, desc: t.feature5Desc, bgClass: "bg-pink-500/20", iconClass: "text-pink-400" },
        { icon: MessageSquare, title: t.feature6Title, desc: t.feature6Desc, bgClass: "bg-orange-500/20", iconClass: "text-orange-400" },
        { icon: Search, title: t.feature7Title, desc: t.feature7Desc, bgClass: "bg-cyan-500/20", iconClass: "text-cyan-400" },
        { icon: Smartphone, title: t.feature8Title, desc: t.feature8Desc, bgClass: "bg-indigo-500/20", iconClass: "text-indigo-400" },
        { icon: BarChart3, title: t.feature9Title, desc: t.feature9Desc, bgClass: "bg-rose-500/20", iconClass: "text-rose-400" },
    ]

    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-purple-500/20 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black pointer-events-none fixed" />
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1200px] h-[600px] bg-purple-500/15 blur-[120px] rounded-full pointer-events-none fixed" />

            <PublicHeader />

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-24 pb-4 relative z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Products</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-purple-400">Personal Shopper</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
                            <ShoppingBag className="w-6 h-6 text-purple-400" />
                            <span className="text-purple-400 font-medium">AI Personal Shopper</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 pb-2">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {t.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/signup">
                                <Button className="h-14 px-10 text-lg bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 rounded-full">
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
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bgClass}`}>
                                        <feature.icon className={`w-6 h-6 ${feature.iconClass}`} />
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
            <section className="py-24 bg-white/5 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.howItWorksTitle}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                                <Store className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step1Title}</h3>
                            <p className="text-gray-400">{t.step1Desc}</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                                <Tags className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step2Title}</h3>
                            <p className="text-gray-400">{t.step2Desc}</p>
                        </div>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                                <TrendingUp className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold">{t.step3Title}</h3>
                            <p className="text-gray-400">{t.step3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {t.ctaTitle}
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {t.ctaSubtitle}
                        </p>
                        <Link href="/signup">
                            <Button className="h-14 px-10 text-lg bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-500/20 transition-all hover:scale-105 rounded-full">
                                {t.ctaButton}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-6">{t.noCreditCard}</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="relative z-10">
                <PublicFooter />
            </div>
        </div>
    )
}
