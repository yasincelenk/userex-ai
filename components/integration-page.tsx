"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Check, MessageCircle, Send, Slack, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useLanguage } from "@/context/LanguageContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface IntegrationPageProps {
    userId: string
}

export default function IntegrationPage({ userId }: IntegrationPageProps) {
    const { toast } = useToast()
    const { t } = useLanguage()
    const [origin, setOrigin] = useState("")
    const [brandColor, setBrandColor] = useState("#000000")
    const [copied, setCopied] = useState<string | null>(null)
    const [settings, setSettings] = useState<any>(null)

    // Channel States
    const [telegramToken, setTelegramToken] = useState("")
    const [isConnectingTelegram, setIsConnectingTelegram] = useState(false)
    const [telegramConnected, setTelegramConnected] = useState(false)
    const [telegramBotName, setTelegramBotName] = useState("")
    const [isTelegramOpen, setIsTelegramOpen] = useState(false)

    // WhatsApp State
    const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false)
    const [waPhoneNumberId, setWaPhoneNumberId] = useState("")
    const [waAccessToken, setWaAccessToken] = useState("")
    const [waVerifyToken, setWaVerifyToken] = useState("")
    const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false)

    // Slack State
    const [isSlackOpen, setIsSlackOpen] = useState(false)
    const [slackBotToken, setSlackBotToken] = useState("")
    const [slackSigningSecret, setSlackSigningSecret] = useState("")
    const [isConnectingSlack, setIsConnectingSlack] = useState(false)
    const [slackConnected, setSlackConnected] = useState(false)
    const [slackTeamName, setSlackTeamName] = useState("")

    const whatsAppConnected = settings?.integrations?.whatsapp?.connected

    const handleConnectWhatsApp = async () => {
        if (!waPhoneNumberId || !waAccessToken || !waVerifyToken) {
            toast({
                title: "Error",
                description: t('fillAllFields'),
                variant: "destructive",
            })
            return
        }

        setIsConnectingWhatsApp(true)
        try {
            const response = await fetch("/api/integrations/whatsapp/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId: userId,
                    phoneNumberId: waPhoneNumberId,
                    accessToken: waAccessToken,
                    verifyToken: waVerifyToken
                })
            })

            if (!response.ok) throw new Error("Failed to connect")

            toast({
                title: "Success",
                description: t('whatsappConnected'),
            })
            setIsWhatsAppOpen(false)
            // Refresh settings
            const docRef = doc(db, "chatbots", userId!)
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                setSettings(snap.data())
            }
        } catch (error) {
            console.error("WhatsApp connect error:", error)
            toast({
                title: "Error",
                description: t('connectionFailed'),
                variant: "destructive",
            })
        } finally {
            setIsConnectingWhatsApp(false)
        }
    }

    const handleConnectSlack = async () => {
        if (!slackBotToken || !slackSigningSecret) {
            toast({
                title: "Error",
                description: "Please fill in all Slack fields",
                variant: "destructive",
            })
            return
        }

        setIsConnectingSlack(true)
        try {
            const response = await fetch("/api/integrations/slack/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    botToken: slackBotToken,
                    signingSecret: slackSigningSecret
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to connect Slack")
            }

            setSlackConnected(true)
            setSlackTeamName(data.team)
            toast({
                title: "Success",
                description: "Slack connected successfully!",
            })
            setIsSlackOpen(false)
            setSlackBotToken("")
            setSlackSigningSecret("")

            // Refresh settings
            const docRef = doc(db, "chatbots", userId!)
            const snap = await getDoc(docRef)
            if (snap.exists()) {
                setSettings(snap.data())
            }

        } catch (error: any) {
            console.error("Error connecting Slack:", error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsConnectingSlack(false)
        }
    }

    useEffect(() => {
        setOrigin(window.location.origin)

        // Fetch settings and integrations
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "chatbots", userId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setSettings(data)
                    setBrandColor(data.brandColor || "#000000")

                    // Check integrations
                    if (data.integrations?.telegram?.connected) {
                        setTelegramConnected(true)
                        setTelegramBotName(data.integrations.telegram.botName || "")
                    }
                    if (data.integrations?.slack?.connected) {
                        setSlackConnected(true)
                        setSlackTeamName(data.integrations.slack.teamName || "")
                    }
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            }
        }
        fetchSettings()
    }, [userId])

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key)
        toast({
            title: t('copied'),
            description: t('codeCopied'),
        })
        setTimeout(() => setCopied(null), 2000)
    }

    const handleConnectTelegram = async () => {
        if (!telegramToken) return

        setIsConnectingTelegram(true)
        try {
            const response = await fetch("/api/integrations/telegram/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, botToken: telegramToken })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to connect Telegram")
            }

            setTelegramConnected(true)
            setTelegramBotName(data.botName)
            toast({
                title: t('success'),
                description: "Telegram bot connected successfully!",
            })
            setTelegramToken("")
        } catch (error: any) {
            console.error("Error connecting Telegram:", error)
            toast({
                title: t('error'),
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setIsConnectingTelegram(false)
        }
    }

    const scriptCode = `<script src="${origin}/widget.js" data-chatbot-id="${userId}" data-color="${brandColor}"></script>`
    const iframeCode = `<iframe src="${origin}/chatbot-view?id=${userId}" width="100%" height="600" frameborder="0"></iframe>`
    const directLink = `${origin}/chatbot-view?id=${userId}`

    return (
        <div className="space-y-6 max-w-4xl">
            <Tabs defaultValue="widget" className="w-full space-y-6">
                <div className="border-b">
                    <TabsList className="h-auto w-full justify-start gap-6 bg-transparent p-0">
                        <TabsTrigger
                            value="widget"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            {t('widgetScript')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="iframe"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            {t('iframeEmbed')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="link"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            {t('directLink')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="wordpress"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            {t('wordpress')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="channels"
                            className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            Channels (Omnichannel)
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="widget" className="space-y-6 m-0">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">{t('widgetScript')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('widgetScriptDescription')}
                            </p>
                        </div>

                        <div className="bg-muted p-4 rounded-md relative group border">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all pr-10 text-foreground">
                                {scriptCode}
                            </pre>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 hover:bg-background"
                                onClick={() => copyToClipboard(scriptCode, "script")}
                            >
                                {copied === "script" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">{t('instructions')}:</h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                                <li>{t('copyCode')}</li>
                                <li>{t('pasteCode')}</li>
                                <li>{t('widgetAppear')}</li>
                            </ol>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="iframe" className="space-y-6 m-0">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">{t('iframeEmbed')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('iframeEmbedDescription')}
                            </p>
                        </div>

                        <div className="bg-muted p-4 rounded-md relative group border">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all pr-10 text-foreground">
                                {iframeCode}
                            </pre>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 hover:bg-background"
                                onClick={() => copyToClipboard(iframeCode, "iframe")}
                            >
                                {copied === "iframe" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">{t('instructions')}:</h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                                <li>{t('copyIframeCode')}</li>
                                <li>{t('pasteIframeCode')}</li>
                                <li>{t('adjustAttributes')}</li>
                            </ol>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-6 m-0">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">{t('directLink')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('directLinkDescription')}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Input value={directLink} readOnly className="font-mono text-sm" />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyToClipboard(directLink, "link")}
                            >
                                {copied === "link" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(directLink, "_blank")}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">{t('usage')}:</h4>
                            <p className="text-sm text-muted-foreground ml-2">
                                {t('shareLink')}
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="wordpress" className="space-y-6 m-0">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">{t('wordpress')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('wordpressDescription')}
                            </p>
                        </div>

                        <div className="bg-muted p-4 rounded-md relative group border">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all pr-10 text-foreground">
                                {scriptCode}
                            </pre>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 hover:bg-background"
                                onClick={() => copyToClipboard(scriptCode, "wordpress")}
                            >
                                {copied === "wordpress" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">{t('instructions')}:</h4>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-2">
                                {(t('wordpressInstructions') || '').split('\n').map((instruction, index) => (
                                    <li key={index}>{instruction.replace(/^\d+\.\s*/, '')}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="channels" className="space-y-6 m-0">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Omnichannel Integrations</h3>
                            <p className="text-sm text-muted-foreground">
                                Connect your AI Assistant to other messaging platforms.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Telegram Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-sky-100 rounded-full">
                                                <Send className="h-5 w-5 text-sky-500" />
                                            </div>
                                            <CardTitle className="text-base">Telegram</CardTitle>
                                        </div>
                                        {telegramConnected && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <Check className="h-3 w-3" /> Connected
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Connect a Telegram Bot to answer user queries automatically.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    {telegramConnected ? (
                                        <div className="text-sm text-muted-foreground">
                                            Connected as: <span className="font-medium text-foreground">@{telegramBotName}</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Create a bot with @BotFather and paste the token here.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant={telegramConnected ? "outline" : "default"} className="w-full">
                                                {telegramConnected ? "Manage Settings" : "Connect Telegram"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Connect Telegram Bot</DialogTitle>
                                                <DialogDescription>
                                                    Enter your Telegram Bot Token below. You can get this from @BotFather on Telegram.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Bot Token</Label>
                                                    <Input
                                                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                                        value={telegramToken}
                                                        onChange={(e) => setTelegramToken(e.target.value)}
                                                    />
                                                </div>
                                                <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                                                    <p className="font-medium mb-1">Webhook URL:</p>
                                                    <code className="break-all">{origin}/api/integrations/telegram/webhook?chatbotId={userId}</code>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleConnectTelegram} disabled={isConnectingTelegram || !telegramToken}>
                                                    {isConnectingTelegram && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Connect & Set Webhook
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>

                            {/* WhatsApp Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <MessageCircle className="h-5 w-5 text-green-600" />
                                            </div>
                                            <CardTitle className="text-base">WhatsApp</CardTitle>
                                        </div>
                                        {whatsAppConnected && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <Check className="h-3 w-3" /> Connected
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Connect WhatsApp Business API to reach customers on their favorite app.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    {whatsAppConnected ? (
                                        <div className="text-sm text-muted-foreground">
                                            WhatsApp Business API is connected.
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Connect your WhatsApp Business Account.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Dialog open={isWhatsAppOpen} onOpenChange={setIsWhatsAppOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant={whatsAppConnected ? "outline" : "default"} className="w-full">
                                                {whatsAppConnected ? "Manage Settings" : "Connect WhatsApp"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Connect WhatsApp Business API</DialogTitle>
                                                <DialogDescription>
                                                    Enter your WhatsApp Business API details below.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="waPhoneNumberId">Phone Number ID</Label>
                                                    <Input
                                                        id="waPhoneNumberId"
                                                        placeholder="e.g. 100609346333333"
                                                        value={waPhoneNumberId}
                                                        onChange={(e) => setWaPhoneNumberId(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="waAccessToken">Access Token</Label>
                                                    <Input
                                                        id="waAccessToken"
                                                        type="password"
                                                        placeholder="e.g. EAAG..."
                                                        value={waAccessToken}
                                                        onChange={(e) => setWaAccessToken(e.target.value)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Generate a permanent access token from Meta for Developers.
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="waVerifyToken">Verify Token</Label>
                                                    <Input
                                                        id="waVerifyToken"
                                                        placeholder="e.g. my_secure_token"
                                                        value={waVerifyToken}
                                                        onChange={(e) => setWaVerifyToken(e.target.value)}
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        This is a token you define to verify your webhook.
                                                    </p>
                                                </div>
                                                <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                                                    <p className="font-medium mb-1">Webhook URL:</p>
                                                    <code className="break-all">{origin}/api/integrations/whatsapp/webhook?chatbotId={userId}</code>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsWhatsAppOpen(false)} disabled={isConnectingWhatsApp}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleConnectWhatsApp} disabled={isConnectingWhatsApp || !waPhoneNumberId || !waAccessToken || !waVerifyToken}>
                                                    {isConnectingWhatsApp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Connect WhatsApp
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>

                            {/* Slack Card */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-purple-100 rounded-full">
                                                <Slack className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <CardTitle className="text-base">Slack</CardTitle>
                                        </div>
                                        {slackConnected && (
                                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                <Check className="h-3 w-3" /> Connected
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Add the AI Assistant to your Slack workspace for internal support.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    {slackConnected ? (
                                        <div className="text-sm text-muted-foreground">
                                            Connected to: <span className="font-medium text-foreground">{slackTeamName}</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">
                                            Connect your Slack App to get started.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Dialog open={isSlackOpen} onOpenChange={setIsSlackOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant={slackConnected ? "outline" : "default"} className="w-full">
                                                {slackConnected ? "Manage Settings" : "Connect Slack"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Connect Slack App</DialogTitle>
                                                <DialogDescription>
                                                    Enter your Slack App credentials below. You can find these in your App Settings.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Bot User OAuth Token</Label>
                                                    <Input
                                                        placeholder="xoxb-..."
                                                        value={slackBotToken}
                                                        onChange={(e) => setSlackBotToken(e.target.value)}
                                                        type="password"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Signing Secret</Label>
                                                    <Input
                                                        placeholder="e.g. 8f7d..."
                                                        value={slackSigningSecret}
                                                        onChange={(e) => setSlackSigningSecret(e.target.value)}
                                                        type="password"
                                                    />
                                                </div>
                                                <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                                                    <p className="font-medium mb-1">Request URL (Event Subscriptions):</p>
                                                    <code className="break-all">{origin}/api/integrations/slack/webhook?chatbotId={userId}</code>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleConnectSlack} disabled={isConnectingSlack || !slackBotToken || !slackSigningSecret}>
                                                    {isConnectingSlack && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Connect Slack
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

