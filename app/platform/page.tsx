"use client"

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Bot, Settings2, Sparkles, Building2, ExternalLink, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext"
import { useState } from "react"
import { ContactSalesForm } from "@/components/billing/contact-sales-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function PlatformPage() {
    const { user, role, enableChatbot } = useAuth()
    const router = useRouter()
    const { t } = useLanguage()

    // State for "Locked" upgrades
    const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null)

    const handleLockedProductClick = (productName: string) => {
        setShowUpgradeModal(productName)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('platformTitle') || "AI Hub"}</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {t('platformSubtitle') || "Manage your active products and explore new AI capabilities."}
                    </p>
                </div>
            </div>

            {/* MAIN PRODUCT: AI Chatbot (Full Width or Large Card) */}
            <div className="grid grid-cols-1">
                <Card className="relative overflow-hidden border-2 border-primary/10 shadow-lg bg-gradient-to-br from-background to-primary/5">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Bot className="w-64 h-64 -mr-12 -mt-12 text-primary" />
                    </div>

                    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">{t('active')}</Badge>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-2">{t('aiSalesChatbot') || "AI Sales Chatbot"}</h2>
                                <p className="text-muted-foreground max-w-2xl text-lg">
                                    {t('aiSalesChatbotDesc') || "Your core automated sales agent. Train it on your products, customize its persona, and let it sell 24/7."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button
                                    size="lg"
                                    onClick={() => router.push("/console/chatbot")}
                                    className="gap-2 shadow-lg shadow-primary/20"
                                >
                                    {t('openConsole') || "Open Console"} <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => router.push("/console/chatbot/shopper/settings")}>
                                    <Settings2 className="w-4 h-4 mr-2" />
                                    {t('settings')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ADD-ONS & ADMIN (Grid) */}
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    {t('addOnsMarketplace') || "Add-ons & Marketplace"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* ADMIN CONSOLE CARD - ONLY VISIBLE TO ADMIN */}
                    {(role === 'admin' || role === 'SUPER_ADMIN') && (
                        <Card className="hover:border-primary/50 cursor-pointer transition-all"
                            onClick={() => router.push("/admin")}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-red-100 text-red-600">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline">
                                        Super Admin
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{t('tenantManagement') || "Tenant Management"}</CardTitle>
                                <CardDescription>
                                    {t('manageTenantsDescription') || "Manage all system tenants, subscriptions, and AI configurations centrally."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between hover:bg-red-100 hover:text-red-700">
                                    {t('accessPanel') || "Access Panel"} <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* SUPER ADMIN CONSOLE CARD - ONLY VISIBLE TO SUPER_ADMIN */}
                    {role === 'SUPER_ADMIN' && (
                        <Card className="hover:border-indigo-500/40 cursor-pointer transition-all"
                            onClick={() => router.push("/platform/super-admin/resources")}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="border-indigo-200 text-indigo-600 bg-indigo-50">
                                        Super Admin
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{t('resourceView') || "Resource View"}</CardTitle>
                                <CardDescription>
                                    {t('systemPerformanceOverview') || "Monitor system-wide resource usage, active chatbots, and tenant statistics."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between hover:bg-indigo-100 hover:text-indigo-700">
                                    {t('viewResources') || "View Resources"} <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* AI Copywriter */}
                    {(role === 'admin' || role === 'SUPER_ADMIN') ? (
                        /* UNLOCKED FOR ADMIN */
                        <Card
                            className="group relative overflow-hidden border bg-white hover:shadow-lg transition-all cursor-pointer border-purple-100/50"
                            onClick={() => router.push("/console/copywriter")}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">{t('adminAccess') || "Admin Access"}</Badge>
                                </div>
                                <CardTitle className="text-xl">{t('aiCopywriter') || "AI Copywriter"}</CardTitle>
                                <CardDescription>
                                    {t('aiCopywriterDesc') || "Generate SEO-optimized product descriptions and blog posts automatically."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between group-hover:bg-purple-50 group-hover:text-purple-700">
                                    {t('openConsole') || "Open Console"} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        /* LOCKED FOR USER */
                        <Card
                            className="group relative overflow-hidden border bg-gray-50/50 hover:bg-white transition-all cursor-pointer hover:shadow-md"
                            onClick={() => handleLockedProductClick('AI Copywriter')}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-gray-200 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                </div>
                                <CardTitle className="text-xl text-gray-600 group-hover:text-gray-900">{t('aiCopywriter') || "AI Copywriter"}</CardTitle>
                                <CardDescription>
                                    {t('aiCopywriterDesc') || "Generate SEO-optimized product descriptions and blog posts automatically."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-start text-muted-foreground group-hover:text-purple-600">
                                    <Lock className="w-4 h-4 mr-2" /> {t('unlockFeature') || "Unlock Feature"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Lead Finder */}
                    {(role === 'admin' || role === 'SUPER_ADMIN') ? (
                        /* UNLOCKED FOR ADMIN */
                        <Card
                            className="group relative overflow-hidden border bg-white hover:shadow-lg transition-all cursor-pointer border-blue-100/50"
                            onClick={() => router.push("/console/lead-finder")}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                        <ExternalLink className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{t('adminAccess') || "Admin Access"}</Badge>
                                </div>
                                <CardTitle className="text-xl">{t('aiLeadFinder') || "AI Lead Finder"}</CardTitle>
                                <CardDescription>
                                    {t('aiLeadFinderDesc') || "Scrape and enrich B2B leads from Google Maps and LinkedIn automatically."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50 group-hover:text-blue-700">
                                    {t('openConsole') || "Open Console"} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        /* LOCKED FOR USER */
                        <Card
                            className="group relative overflow-hidden border bg-gray-50/50 hover:bg-white transition-all cursor-pointer hover:shadow-md"
                            onClick={() => handleLockedProductClick('AI Lead Finder')}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-gray-200 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <ExternalLink className="w-6 h-6" />
                                    </div>
                                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <CardTitle className="text-xl text-gray-600 group-hover:text-gray-900">{t('aiLeadFinder') || "AI Lead Finder"}</CardTitle>
                                <CardDescription>
                                    {t('aiLeadFinderDesc') || "Scrape and enrich B2B leads from Google Maps and LinkedIn automatically."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-start text-muted-foreground group-hover:text-blue-600">
                                    <Lock className="w-4 h-4 mr-2" /> {t('unlockFeature') || "Unlock Feature"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* UI/UX Auditor */}
                    {(role === 'admin' || role === 'SUPER_ADMIN') ? (
                        /* UNLOCKED FOR ADMIN */
                        <Card
                            className="group relative overflow-hidden border bg-white hover:shadow-lg transition-all cursor-pointer border-orange-100/50"
                            onClick={() => router.push("/console/ui-ux-auditor")}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">{t('adminAccess') || "Admin Access"}</Badge>
                                </div>
                                <CardTitle className="text-xl">{t('uiUxAuditor') || "UI/UX Auditor"}</CardTitle>
                                <CardDescription>
                                    {t('uiUxAuditorDesc') || "Analyze your website's usability and conversion rate optimization (CRO) with AI."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-between group-hover:bg-orange-50 group-hover:text-orange-700">
                                    {t('openConsole') || "Open Console"} <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        /* LOCKED FOR USER */
                        <Card
                            className="group relative overflow-hidden border bg-gray-50/50 hover:bg-white transition-all cursor-pointer hover:shadow-md"
                            onClick={() => handleLockedProductClick('UI/UX Auditor')}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-gray-200 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                                </div>
                                <CardTitle className="text-xl text-gray-600 group-hover:text-gray-900">{t('uiUxAuditor') || "UI/UX Auditor"}</CardTitle>
                                <CardDescription>
                                    {t('uiUxAuditorDesc') || "Analyze your website's usability and conversion rate optimization (CRO) with AI."}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button variant="ghost" className="w-full justify-start text-muted-foreground group-hover:text-orange-600">
                                    <Lock className="w-4 h-4 mr-2" /> {t('unlockFeature') || "Unlock Feature"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>

            {/* Upgrade Modal */}
            <Dialog open={!!showUpgradeModal} onOpenChange={() => setShowUpgradeModal(null)}>
                <DialogContent className="sm:max-w-xl">
                    <ContactSalesForm
                        planId={`Add-on: ${showUpgradeModal}`}
                        onBack={() => setShowUpgradeModal(null)}
                        onSuccess={() => setShowUpgradeModal(null)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
