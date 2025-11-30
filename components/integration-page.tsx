"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useLanguage } from "@/context/LanguageContext"

interface IntegrationPageProps {
    userId: string
}

export default function IntegrationPage({ userId }: IntegrationPageProps) {
    const { toast } = useToast()
    const { t } = useLanguage()
    const [origin, setOrigin] = useState("")
    const [brandColor, setBrandColor] = useState("#000000")
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        setOrigin(window.location.origin)

        // Fetch brand color to make the snippet accurate
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "chatbots", userId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setBrandColor(docSnap.data().brandColor || "#000000")
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
            </Tabs>
        </div>
    )
}
