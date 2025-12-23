"use client"

import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, FileText } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionPage() {
    const { t } = useLanguage()
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const plans = [
        {
            name: "STARTER",
            price: billingCycle === 'monthly' ? 29 : 24,
            currency: "$",
            features: [
                "2,000 chats/mo",
                "1 Active Chatbot",
                "Basic Analytics",
                "Email Support"
            ],
            current: false
        },
        {
            name: "TEAM",
            price: billingCycle === 'monthly' ? 99 : 79,
            currency: "$",
            features: [
                "10,000 chats/mo",
                "5 Active Chatbots",
                "Advanced Analytics",
                "Priority Support",
                "Remove Branding"
            ],
            popular: true,
            current: true,
            trialEnding: 7
        },
        {
            name: "BUSINESS",
            price: billingCycle === 'monthly' ? 299 : 249,
            currency: "$",
            features: [
                "Unlimited chats",
                "Unlimited Chatbots",
                "Custom Integrations",
                "Dedicated Success Manager",
                "SLA Support"
            ],
            current: false
        }
    ]

    return (
        <div className="space-y-6 container mx-auto max-w-6xl py-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t('subscription')}</h1>
                <p className="text-muted-foreground">{t('subscriptionDescription')}</p>
            </div>

            <Card className="border-2 border-primary/10 overflow-hidden">
                <div className="bg-primary/5 p-4 text-center border-b border-primary/10">
                    <p className="text-sm font-medium">
                        Your current plan: <span className="font-bold">Team free trial</span>, ends in <span className="font-bold">7 days</span>.
                        Subscribe now to keep using Vion without interruption.
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-muted p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('monthly')}
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t('annual')}
                                <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                    {t('savePercent')} 20%
                                </Badge>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col rounded-xl border-2 p-6 transition-all ${plan.current ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600 ring-offset-2' : 'border-border hover:border-primary/50'}`}
                            >
                                {plan.current && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {t('currentPlan')}
                                    </div>
                                )}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-muted-foreground">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold">{plan.currency}{plan.price}</span>
                                        <span className="text-muted-foreground">/mo</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-6 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <div className={`p-0.5 rounded-full ${plan.current ? 'bg-blue-600 text-white' : 'bg-primary/10 text-primary'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full ${plan.current ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    variant={plan.current ? 'default' : 'outline'}
                                >
                                    {plan.current ? 'Manage Plan' : t('upgrade')}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-muted/30 p-6 md:p-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-full border shadow-sm">
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Secure Payment</p>
                            <p className="text-xs text-muted-foreground">Encrypted via Stripe</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <FileText className="w-4 h-4" />
                            {t('invoices')}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
