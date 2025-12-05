"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Globe,
    Layout,
    MessageSquare,
    Shield,
    Zap,
    ShoppingBag,
    PenTool,
    Search,
    BarChart3,
    Users
} from "lucide-react"
import Script from "next/script"

export default function LandingPage() {
    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-blue-500/20 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span>Userex AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#products" className="hover:text-white transition-colors">Products</Link>
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-white/90 font-medium shadow-lg shadow-white/10">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 animate-fade-in backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            The All-in-One AI Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 pb-2">
                            Supercharge Your Business with AI Agents
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Deploy intelligent agents for support, sales, content, and lead generation.
                            One platform to automate your growth.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/signup">
                                <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 w-full sm:w-auto transition-all hover:scale-105">
                                    Start for free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            Meet Your New AI Team
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Powerful AI agents designed to handle specific aspects of your business, working together seamlessly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* AI Chatbot */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold">AI Customer Support</h3>
                                <p className="text-muted-foreground">
                                    24/7 intelligent support that resolves 80% of queries instantly. Learns from your documents and website to provide accurate answers.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Multilingual Support</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Lead Collection</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Seamless Handoff</li>
                                </ul>
                            </div>
                        </div>

                        {/* Personal Shopper */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShoppingBag className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <ShoppingBag className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Personal Shopper</h3>
                                <p className="text-muted-foreground">
                                    Turn visitors into buyers with personalized product recommendations. An AI that understands style, preferences, and intent.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Smart Recommendations</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Visual Search</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Upselling & Cross-selling</li>
                                </ul>
                            </div>
                        </div>

                        {/* AI Copywriter */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <PenTool className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                    <PenTool className="w-6 h-6 text-pink-400" />
                                </div>
                                <h3 className="text-2xl font-bold">AI Copywriter</h3>
                                <p className="text-muted-foreground">
                                    Generate high-converting marketing copy, blog posts, and social media content in seconds. Your brand voice, perfected.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> SEO Optimized</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> Multi-format Content</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> Brand Voice Adaptation</li>
                                </ul>
                            </div>
                        </div>

                        {/* Lead Finder */}
                        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Search className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Search className="w-6 h-6 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Lead Finder</h3>
                                <p className="text-muted-foreground">
                                    Discover and qualify potential clients automatically. Scrape the web for leads that match your ideal customer profile.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Automated Prospecting</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Email Enrichment</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> CRM Integration</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
                        <p className="text-muted-foreground">Built for modern businesses that demand performance and reliability.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Global Reach",
                                description: "Speak your customers' language with support for over 50 languages."
                            },
                            {
                                icon: BarChart3,
                                title: "Deep Analytics",
                                description: "Gain actionable insights into customer behavior and agent performance."
                            },
                            {
                                icon: Zap,
                                title: "Instant Setup",
                                description: "Get up and running in minutes with our easy-to-use widget."
                            },
                            {
                                icon: Shield,
                                title: "Enterprise Security",
                                description: "Your data is protected with bank-grade encryption and privacy controls."
                            },
                            {
                                icon: Layout,
                                title: "Custom Branding",
                                description: "Fully customizable widgets to match your brand identity."
                            },
                            {
                                icon: Users,
                                title: "Team Collaboration",
                                description: "Seamlessly hand off conversations to human agents when needed."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white/80" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-black pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            Ready to transform your business?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join the AI revolution today. Start your free trial and see the difference Userex AI can make.
                        </p>
                        <Link href="/signup">
                            <Button className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5 transition-all hover:scale-105">
                                Create your account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 bg-black">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span>Userex AI</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2024 Userex AI. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
            <Script
                src="/widget.js"
                data-chatbot-id="qqv4HRZyAuUwsApyYxoBEgTs4hC2"
                strategy="afterInteractive"
            />
        </div>
    )
}
