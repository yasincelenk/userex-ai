"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, X, Sparkles, Building2, Rocket } from "lucide-react";
import { ContactSalesForm } from './contact-sales-form';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan?: string;
}

export function PricingModal({ isOpen, onClose, currentPlan = 'free' }: PricingModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const plans = [
        {
            id: 'free',
            name: 'Free Trial',
            price: 'Free',
            period: '/ 14 Days',
            icon: Rocket,
            description: 'Full access to test Userex AI before you commit.',
            features: [
                '50 Test Conversations',
                'Basic Proactive Triggers',
                'Standard Analytics',
                'Standard Support',
                'Multi-language (EN, TR, DE, ES)'
            ],
            missing: [
                'No "Powered by" Removal',
                'Personal Shopper AI',
                'Advanced Analytics',
            ],
            buttonText: 'Start Trial',
            isPopular: false
        },
        {
            id: 'pro',
            name: 'Pro Business',
            price: '₺950',
            period: '/ month',
            icon: Sparkles,
            description: 'For growing businesses needing AI sales power.',
            features: [
                '2,000 Conversations / month',
                '✨ AI Personal Shopper Mode',
                'Advanced Proactive Engagement',
                'Remove "Powered by" Branding',
                'Priority Email Support',
                'Multi-language (EN, TR, DE, ES)'
            ],
            missing: [],
            buttonText: 'Upgrade to Pro',
            isPopular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            icon: Building2,
            description: 'For large teams requiring custom limits & SLA.',
            features: [
                'Custom Conversation Vol.',
                'Dedicated Account Manager',
                'Custom AI Training',
                'API Access',
                'SLA & Uptime Guarantee',
                'Multi-language (EN, TR, DE, ES)'
            ],
            missing: [],
            buttonText: 'Contact Sales',
            isPopular: false
        }
    ];

    if (selectedPlan) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Contact Sales - {plans.find(p => p.id === selectedPlan)?.name}</DialogTitle>
                        <DialogDescription>
                            Complete the form below to request an upgrade.
                        </DialogDescription>
                    </DialogHeader>
                    <ContactSalesForm
                        planId={selectedPlan}
                        onBack={() => setSelectedPlan(null)}
                        onSuccess={onClose}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center mb-8">
                    <DialogTitle className="text-3xl font-bold">Simple, Transparent Pricing</DialogTitle>
                    <DialogDescription className="text-lg">
                        Choose the plan that fits your growth.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl border p-6 flex flex-col ${plan.isPopular
                                ? 'border-lime-500 shadow-xl ring-2 ring-lime-500 bg-white'
                                : 'border-gray-200 bg-gray-50/50'
                                }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lime-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-lg ${plan.isPopular ? 'bg-lime-100 text-lime-700' : 'bg-gray-200 text-gray-600'}`}>
                                    <plan.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    <p className="text-sm text-gray-500">{plan.description}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                <span className="text-gray-500 font-medium ml-1">{plan.period}</span>
                            </div>

                            <div className="space-y-3 flex-1 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <Check className={`w-5 h-5 flex-shrink-0 ${plan.isPopular ? 'text-lime-600' : 'text-green-600'}`} />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                                {plan.missing.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm opacity-50">
                                        <X className="w-5 h-5 flex-shrink-0 text-gray-400" />
                                        <span className="text-gray-500 line-through">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (plan.id === currentPlan) return;
                                    setSelectedPlan(plan.id);
                                }}
                                disabled={plan.id === currentPlan}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${plan.id === currentPlan
                                    ? 'bg-gray-100 text-gray-400 cursor-default'
                                    : plan.isPopular
                                        ? 'bg-lime-600 text-white hover:bg-lime-700 shadow-md hover:shadow-lg'
                                        : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                {plan.id === currentPlan ? 'Current Plan' : plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
