"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, CheckCircle2, Globe, Layout, MessageSquare, Shield, Zap } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="dark min-h-screen bg-black text-white selection:bg-blue-500/20">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span>Userex AI</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#integration" className="hover:text-white transition-colors">Integration</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-white/90">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-black to-black" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Now available for everyone
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                            Transform Your Customer Support with AI
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Empower your business with an intelligent, customizable, and 24/7 available AI Assistant. Setup in minutes, not days.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/signup">
                                <Button size="lg" className="h-12 px-8 text-lg bg-white text-black hover:bg-white/90 w-full sm:w-auto">
                                    Start for free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                                    View Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-black/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
                        <p className="text-muted-foreground">Powerful features to help you manage and grow your customer relationships.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MessageSquare,
                                title: "24/7 Availability",
                                description: "Never miss a customer query. Your AI assistant works round the clock to provide instant support."
                            },
                            {
                                icon: Layout,
                                title: "Custom Branding",
                                description: "Make it yours. Customize the widget's look and feel to perfectly match your brand identity."
                            },
                            {
                                icon: Globe,
                                title: "Multi-language",
                                description: "Speak your customers' language. Automatically detect and respond in over 50 languages."
                            },
                            {
                                icon: Zap,
                                title: "Instant Setup",
                                description: "Get up and running in minutes. Just copy and paste a simple code snippet to your website."
                            },
                            {
                                icon: Shield,
                                title: "Secure & Private",
                                description: "Enterprise-grade security. Your data and your customers' data are always protected."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Smart Knowledge Base",
                                description: "Train your AI with your own data. Upload documents or link your website for accurate answers."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-blue-400" />
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
                <div className="absolute inset-0 bg-blue-500/5" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join thousands of businesses using Userex AI to improve their customer support.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="h-12 px-8 text-lg bg-white text-black hover:bg-white/90">
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

            {/* Main Chatbot Widget */}
            <script
                src="/widget.js"
                data-chatbot-id="XHhntxd3Y1ZX7armD0frdCjbSVS2"
                data-color="#001029"
                defer
            ></script>
        </div>
    )
}
