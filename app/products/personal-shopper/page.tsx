"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    ShoppingBag,
    Zap,
    Search,
    TrendingUp,
    Smartphone,
    Share2,
    Tags,
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
import { useAuth } from "@/context/AuthContext"
import { HeroBackground } from "@/components/landing/hero-background"

type SupportedLanguage = 'en' | 'tr'

export default function PersonalShopperPage() {
    const { language: globalLanguage } = useLanguage()
    const { user } = useAuth()
    const language = (globalLanguage === 'tr' ? 'tr' : 'en') as SupportedLanguage

    const content = {
        en: {
            heroTitle: "Your AI Personal Shopper & Sales Expert",
            heroSubtitle: "Transform your e-commerce store with an AI that understands style, recommends features, and closes sales 24/7.",
            startFree: "Start Free Trial",

            featuresTitle: "Drive More Sales with Intelligent Recommendations",
            featuresSubtitle: "Turn visitors into buyers with an AI that acts like your best in-store sales associate.",

            feature1Title: "Product Catalog Integration",
            feature1Desc: "Seamlessly sync your products. The AI knows your inventory, prices, and variants instantly.",
            feature2Title: "Smart Recommendations",
            feature2Desc: "Suggests the perfect products based on user preferences, budget, and style.",
            feature3Title: "Visual Product Cards",
            feature3Desc: "Displays products in attractive cards within the chat. Users can click to buy content immediately.",
            feature4Title: "Upselling & Cross-selling",
            feature4Desc: "Automatically suggests complementary items to increase average order value.",
            feature5Title: "Social Sharing",
            feature5Desc: "Users can share product cards directly from the chat to WhatsApp or Social Media.",
            feature6Title: "Abandoned Cart Recovery",
            feature6Desc: "Engage users who are hesitant. Offer personalized discounts to save the sale.",
            feature7Title: "Order Tracking",
            feature7Desc: "Allow customers to check their order status directly within the chat interface.",
            feature8Title: "Multi-Platform",
            feature8Desc: "Deploy your sales agent on your Website, WhatsApp, and Social Media channels.",
            feature9Title: "Sales Analytics",
            feature9Desc: "Track which products are being recommended and clicked most often.",

            howItWorksTitle: "Turn Browsers into Buyers",
            step1Title: "1. Connect Catalog",
            step1Desc: "Sync your Shopify, WooCommerce, or custom feed in seconds.",
            step2Title: "2. Define Strategy",
            step2Desc: "Set your sales tone (Aggressive, Helpful, Luxury) and recommendation logic.",
            step3Title: "3. Start Selling",
            step3Desc: "The AI engages visitors, guides them to products, and boosts your conversion rate.",

            ctaTitle: "Ready to Boost Your E-commerce Sales?",
            ctaSubtitle: "Join top brands using Vion to deliver personalized shopping experiences at scale.",
            ctaButton: "Create Your Store Bot",
            noCreditCard: "No credit card required • 14-day free trial",
        },
        tr: {
            heroTitle: "AI Kişisel Alışveriş Asistanınız & Satış Uzmanınız",
            heroSubtitle: "E-ticaret mağazanızı; tarzı anlayan, özellik öneren ve 7/24 satış kapatan bir AI ile dönüştürün.",
            startFree: "Ücretsiz Deneyin",

            featuresTitle: "Akıllı Önerilerle Daha Fazla Satış Yapın",
            featuresSubtitle: "Ziyaretçilerinizi, mağazanızdaki en iyi satış danışmanı gibi davranan bir AI ile alıcılara dönüştürün.",

            feature1Title: "Ürün Kataloğu Entegrasyonu",
            feature1Desc: "Ürünlerinizi sorunsuz bir şekilde senkronize edin. AI, envanterinizi, fiyatlarınızı ve varyasyonlarınızı anında bilir.",
            feature2Title: "Akıllı Öneriler",
            feature2Desc: "Kullanıcı tercihlerine, bütçesine ve tarzına göre mükemmel ürünleri önerir.",
            feature3Title: "Görsel Ürün Kartları",
            feature3Desc: "Ürünleri sohbet içinde çekici kartlarla gösterir. Kullanıcılar hemen satın almak için tıklayabilir.",
            feature4Title: "Upselling & Çapraz Satış",
            feature4Desc: "Ortalama sipariş değerini artırmak için tamamlayıcı ürünleri otomatik olarak önerir.",
            feature5Title: "Sosyal Paylaşım",
            feature5Desc: "Kullanıcılar ürün kartlarını doğrudan sohbetten WhatsApp veya Sosyal Medya'da paylaşabilir.",
            feature6Title: "Terk Edilmiş Sepet Kurtarma",
            feature6Desc: "Kararsız kalan kullanıcılarla etkileşime geçin. Satışı kurtarmak için kişisel indirimler sunun.",
            feature7Title: "Sipariş Takibi",
            feature7Desc: "Müşterilerin sipariş durumlarını doğrudan sohbet arayüzünden kontrol etmelerine izin verin.",
            feature8Title: "Çoklu Platform",
            feature8Desc: "Satış temsilcinizi Web Sitenizde, WhatsApp'ta ve Sosyal Medya kanallarınızda dağıtın.",
            feature9Title: "Satış Analitiği",
            feature9Desc: "Hangi ürünlerin en sık önerildiğini ve tıklandığını takip edin.",

            howItWorksTitle: "Ziyaretçileri Müşteriye Dönüştürün",
            step1Title: "1. Kataloğu Bağla",
            step1Desc: "Shopify, WooCommerce veya özel akışınızı saniyeler içinde senkronize edin.",
            step2Title: "2. Stratejiyi Belirle",
            step2Desc: "Satış tonunuzu (Agresif, Yardımsever, Lüks) ve öneri mantığınızı ayarlayın.",
            step3Title: "3. Satışa Başla",
            step3Desc: "AI ziyaretçilerle etkileşime geçer, onları ürünlere yönlendirir ve dönüşüm oranınızı artırır.",

            ctaTitle: "E-ticaret Satışlarınızı Artırmaya Hazır mısınız?",
            ctaSubtitle: "Ölçeklenebilir kişiselleştirilmiş alışveriş deneyimleri sunmak için Vion kullanan lider markalara katılın.",
            ctaButton: "Mağaza Botunuzu Oluşturun",
            noCreditCard: "Kredi kartı gerekmez • 14 günlük ücretsiz deneme",
        }
    }

    const t = content[language]

    const features = [
        { icon: Store, title: t.feature1Title, desc: t.feature1Desc },
        { icon: Zap, title: t.feature2Title, desc: t.feature2Desc },
        { icon: LayoutGrid, title: t.feature3Title, desc: t.feature3Desc },
        { icon: TrendingUp, title: t.feature4Title, desc: t.feature4Desc },
        { icon: Share2, title: t.feature5Title, desc: t.feature5Desc },
        { icon: MessageSquare, title: t.feature6Title, desc: t.feature6Desc },
        { icon: Search, title: t.feature7Title, desc: t.feature7Desc },
        { icon: Smartphone, title: t.feature8Title, desc: t.feature8Desc },
        { icon: BarChart3, title: t.feature9Title, desc: t.feature9Desc },
    ]

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-hidden">
            <PublicHeader />

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 pt-24 pb-4 relative z-10">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white">Products</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-zinc-300">Personal Shopper</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-white/5">
                <HeroBackground />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <ShoppingBag className="w-5 h-5 text-white" />
                            <span className="text-zinc-200 font-medium text-sm">AI Personal Shopper</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                            {t.heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            {user ? (
                                <Link href="/platform">
                                    <Button className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 transition-all rounded-full font-medium">
                                        {language === 'tr' ? 'Panele Git' : 'Go to Console'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/signup">
                                    <Button className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 transition-all rounded-full font-medium">
                                        {t.startFree}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            {t.featuresTitle}
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
                            {t.featuresSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300 hover:border-white/10">
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/50 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 border-t border-white/5 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white tracking-tight">{t.howItWorksTitle}</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dashed" />

                        <div className="text-center space-y-6 relative group">
                            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mx-auto z-10 relative group-hover:border-white/30 transition-colors">
                                <Store className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{t.step1Title}</h3>
                            <p className="text-zinc-500 leading-relaxed max-w-xs mx-auto">{t.step1Desc}</p>
                        </div>
                        <div className="text-center space-y-6 relative group">
                            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mx-auto z-10 relative group-hover:border-white/30 transition-colors">
                                <Tags className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{t.step2Title}</h3>
                            <p className="text-zinc-500 leading-relaxed max-w-xs mx-auto">{t.step2Desc}</p>
                        </div>
                        <div className="text-center space-y-6 relative group">
                            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mx-auto z-10 relative group-hover:border-white/30 transition-colors">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{t.step3Title}</h3>
                            <p className="text-zinc-500 leading-relaxed max-w-xs mx-auto">{t.step3Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden border-t border-white/5">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                            {t.ctaTitle}
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto font-light">
                            {t.ctaSubtitle}
                        </p>
                        <Link href={user ? "/platform" : "/signup"}>
                            <Button className="h-14 px-12 text-lg bg-white text-black hover:bg-zinc-200 shadow-xl transition-all hover:scale-105 rounded-full font-medium">
                                {user ? (language === 'tr' ? 'Panele Git' : 'Go to Console') : t.ctaButton}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <p className="text-sm text-zinc-500 mt-6">{t.noCreditCard}</p>
                    </div>
                </div>
            </section>

            <div className="relative z-10">
                <PublicFooter />
            </div>
        </div>
    )
}
