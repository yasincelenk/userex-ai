"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    TrendingUp,
    Building2,
    Palette,
    Tag,
    Package,
    ShoppingCart,
    GitCompare,
    CheckCircle2,
    X,
    Minus
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { useLanguage } from "@/context/LanguageContext"

export default function WhyPage() {
    const { t, language } = useLanguage()

    const comparisonData = [
        { feature: language === 'tr' ? 'Satış Optimizasyonu' : 'Sales Optimization', userex: true, tawkto: false, intercom: 'partial', drift: 'partial' },
        { feature: language === 'tr' ? 'Sektöre Özel AI' : 'Industry-Specific AI', userex: true, tawkto: false, intercom: false, drift: false },
        { feature: language === 'tr' ? 'Marka Özelleştirme' : 'Brand Customization', userex: 'free', tawkto: '$29/mo', intercom: '$$$', drift: '$$$' },
        { feature: language === 'tr' ? 'XML Feed Sync' : 'XML Feed Sync', userex: true, tawkto: false, intercom: false, drift: false },
        { feature: language === 'tr' ? 'Stok Uyarıları' : 'Stock Alerts', userex: true, tawkto: false, intercom: false, drift: false },
        { feature: language === 'tr' ? 'Sepet Kurtarma' : 'Cart Recovery', userex: true, tawkto: false, intercom: 'partial', drift: true },
        { feature: language === 'tr' ? 'Randevu Sistemi' : 'Appointment System', userex: true, tawkto: false, intercom: true, drift: true },
        { feature: language === 'tr' ? 'UI/UX Auditor' : 'UI/UX Auditor', userex: true, tawkto: false, intercom: false, drift: false },
        { feature: language === 'tr' ? 'Canlı Destek (Takeover)' : 'Live Chat (Takeover)', userex: true, tawkto: true, intercom: true, drift: true },
        { feature: language === 'tr' ? 'Knowledge Base' : 'Knowledge Base', userex: true, tawkto: true, intercom: true, drift: false },
        { feature: language === 'tr' ? 'Lead Toplama' : 'Lead Collection', userex: true, tawkto: true, intercom: true, drift: true },
        { feature: language === 'tr' ? 'Çok Kanallı' : 'Omnichannel', userex: 'partial', tawkto: true, intercom: true, drift: true },
    ]

    const renderStatus = (status: boolean | string) => {
        if (status === true) return <CheckCircle2 className="w-5 h-5 text-lime-500" />
        if (status === false) return <X className="w-5 h-5 text-red-500/50" />
        if (status === 'partial') return <Minus className="w-5 h-5 text-yellow-500" />
        return <span className="text-sm text-muted-foreground">{status}</span>
    }

    return (
        <div className="dark min-h-screen bg-black text-white font-sans">
            <PublicHeader />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/20 via-black to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            {language === 'tr' ? 'Neden exAi?' : 'Why exAi?'}
                        </h1>
                        <p className="text-xl text-lime-400 font-semibold">
                            {language === 'tr' ? '"Satış yapan chatbot. Destek değil, dönüşüm."' : '"Sales-focused chatbot. Not support, conversion."'}
                        </p>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {language === 'tr'
                                ? 'Rakipler müşteri desteği için tasarlandı. Biz müşteri kazanımı için.'
                                : 'Competitors are designed for customer support. We are designed for customer acquisition.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3 Main Differences */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {language === 'tr' ? '3 Ana Fark' : '3 Key Differences'}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sales Focused */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-lime-500/10 to-transparent border border-lime-500/20 hover:border-lime-500/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-lime-500/20 flex items-center justify-center mb-6">
                                <TrendingUp className="w-8 h-8 text-lime-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {language === 'tr' ? 'Satış Odaklı' : 'Sales Focused'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {language === 'tr'
                                    ? '"Nasıl yardımcı olabilirim?" yerine "Bu ürünü almanızı öneririm" der.'
                                    : 'Instead of "How can I help?" says "I recommend this product for you."'}
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> {language === 'tr' ? 'İndirim kodu önerisi' : 'Discount code offers'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> {language === 'tr' ? 'Stok uyarıları' : 'Stock alerts'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime-500" /> {language === 'tr' ? 'Sepet kurtarma' : 'Cart recovery'}</li>
                            </ul>
                        </div>

                        {/* Industry Intelligence */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                                <Building2 className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {language === 'tr' ? 'Sektör Zekası' : 'Industry Intelligence'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {language === 'tr'
                                    ? '10 farklı sektöre özel AI davranışı. E-ticarete farklı, seyahate farklı.'
                                    : '10 different industry-specific AI behaviors. Different for e-commerce, different for travel.'}
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {language === 'tr' ? 'E-ticaret' : 'E-commerce'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {language === 'tr' ? 'Seyahat' : 'Travel'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> {language === 'tr' ? '+8 sektör daha' : '+8 more industries'}</li>
                            </ul>
                        </div>

                        {/* Brand Freedom */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
                                <Palette className="w-8 h-8 text-pink-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {language === 'tr' ? 'Marka Özgürlüğü' : 'Brand Freedom'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {language === 'tr'
                                    ? 'Logonuzu kullanın, bizimkini değil. Ücretsiz. Rakiplerde $29/ay.'
                                    : 'Use your logo, not ours. Free. Competitors charge $29/month.'}
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {language === 'tr' ? 'Özel renkler' : 'Custom colors'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {language === 'tr' ? 'Logo & avatar' : 'Logo & avatar'}</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> {language === 'tr' ? 'Branding silme: $0' : 'Remove branding: $0'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sales Optimization Features */}
            <section className="py-20 bg-white/5">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        {language === 'tr' ? 'Satış Optimizasyonu' : 'Sales Optimization'}
                    </h2>
                    <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                        {language === 'tr'
                            ? 'Chatbot\'unuz sadece soru cevaplamaz, satış yapar.'
                            : 'Your chatbot doesn\'t just answer questions, it sells.'}
                    </p>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-colors text-center">
                            <Tag className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">{language === 'tr' ? 'İndirim Kodları' : 'Discount Codes'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {language === 'tr' ? '"Size özel %10 indirim kodu"' : '"Special 10% discount for you"'}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-orange-500/30 transition-colors text-center">
                            <Package className="w-10 h-10 text-orange-400 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">{language === 'tr' ? 'Stok Uyarıları' : 'Stock Alerts'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {language === 'tr' ? '"Sadece 3 adet kaldı!"' : '"Only 3 left in stock!"'}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors text-center">
                            <ShoppingCart className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">{language === 'tr' ? 'Sepet Kurtarma' : 'Cart Recovery'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {language === 'tr' ? 'Terk edilen sepetleri geri kazan' : 'Recover abandoned carts'}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-green-500/30 transition-colors text-center">
                            <GitCompare className="w-10 h-10 text-green-400 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">{language === 'tr' ? 'Ürün Karşılaştırma' : 'Product Comparison'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {language === 'tr' ? 'En iyi seçeneği öner' : 'Recommend the best option'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        {language === 'tr' ? 'Rakiplerle Karşılaştırma' : 'Competitor Comparison'}
                    </h2>
                    <p className="text-muted-foreground text-center mb-12">
                        {language === 'tr' ? 'Özelliklere göre kıyaslama' : 'Feature-by-feature comparison'}
                    </p>
                    <div className="max-w-5xl mx-auto overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-4 w-[200px]">{language === 'tr' ? 'Özellik' : 'Feature'}</th>
                                    <th className="py-4 px-4 text-lime-400 w-[120px]"><div className="flex justify-center">exAi</div></th>
                                    <th className="py-4 px-4 text-muted-foreground w-[120px]"><div className="flex justify-center">Tawk.to</div></th>
                                    <th className="py-4 px-4 text-muted-foreground w-[120px]"><div className="flex justify-center">Intercom</div></th>
                                    <th className="py-4 px-4 text-muted-foreground w-[120px]"><div className="flex justify-center">Drift</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-sm">{row.feature}</td>
                                        <td className="py-4 px-4"><div className="flex justify-center">{renderStatus(row.userex)}</div></td>
                                        <td className="py-4 px-4"><div className="flex justify-center">{renderStatus(row.tawkto)}</div></td>
                                        <td className="py-4 px-4"><div className="flex justify-center">{renderStatus(row.intercom)}</div></td>
                                        <td className="py-4 px-4"><div className="flex justify-center">{renderStatus(row.drift)}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center bg-gradient-to-b from-lime-500/10 to-transparent border border-lime-500/20 rounded-3xl p-12">
                        <h2 className="text-3xl font-bold mb-4">
                            {language === 'tr' ? 'Hazır mısınız?' : 'Ready to Start?'}
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            {language === 'tr'
                                ? 'Satış yapan chatbot\'unuzu bugün oluşturun.'
                                : 'Create your sales-focused chatbot today.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button className="h-12 px-8 bg-lime-600 hover:bg-lime-500 text-white">
                                    {language === 'tr' ? 'Ücretsiz Başla' : 'Start Free'}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="outline" className="h-12 px-8 border-white/20 hover:bg-white/5">
                                    {language === 'tr' ? 'Demo Talep Et' : 'Request Demo'}
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
