"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface KnowledgeDoc {
    id: string
    title: string
    content: string
    fullContent?: string
    createdAt: any
}

interface KnowledgeBaseProps {
    targetUserId?: string
    embedded?: boolean
}

import { useLanguage } from "@/context/LanguageContext"

export function KnowledgeBase({ targetUserId, embedded = false }: KnowledgeBaseProps) {
    const { user } = useAuth()
    const { t } = useLanguage()
    const userId = targetUserId || user?.uid

    const { toast } = useToast()
    const [docs, setDocs] = useState<KnowledgeDoc[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)

    // Form State
    const [activeTab, setActiveTab] = useState("text")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [url, setUrl] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null)

    const fetchDocs = async () => {
        if (!userId) return
        setIsLoading(true)
        try {
            const q = query(
                collection(db, "knowledge_docs"),
                where("chatbotId", "==", userId),
                orderBy("createdAt", "desc")
            )
            const querySnapshot = await getDocs(q)
            const fetchedDocs: KnowledgeDoc[] = []
            querySnapshot.forEach((doc) => {
                fetchedDocs.push({ id: doc.id, ...doc.data() } as KnowledgeDoc)
            })
            setDocs(fetchedDocs)
        } catch (error) {
            console.error("Error fetching docs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDocs()
    }, [userId])

    const handleAddKnowledge = async () => {
        if (!userId) return

        // Validation
        if (activeTab === "text" && (!title || !content)) return
        if (activeTab === "url" && !url) return
        if (activeTab === "file" && !file) return
        if (activeTab === "qa" && (!question || !answer)) return

        setIsAdding(true)
        try {
            let docId = ""
            let payload = {}

            if (activeTab === "text") {
                // 1. Save to Firestore (Metadata)
                const docRef = await addDoc(collection(db, "knowledge_docs"), {
                    chatbotId: userId,
                    title,
                    type: "text",
                    content: content.substring(0, 200) + "...",
                    fullContent: content,
                    createdAt: serverTimestamp()
                })
                docId = docRef.id
                payload = { chatbotId: userId, docId, type: "text", text: content }
            } else if (activeTab === "url") {
                // If we have content (fetched via preview), treat it as text but with URL source
                if (content) {
                    // 1. Save to Firestore (Metadata)
                    const docRef = await addDoc(collection(db, "knowledge_docs"), {
                        chatbotId: userId,
                        title: title || url,
                        type: "url",
                        source: url,
                        content: content.substring(0, 200) + "...",
                        fullContent: content,
                        createdAt: serverTimestamp()
                    })
                    docId = docRef.id
                    // Send as text to API to avoid re-scraping
                    payload = { chatbotId: userId, docId, type: "text", text: content, url, fileName: url }
                } else {
                    // Fallback to old behavior (API scrapes)
                    payload = { chatbotId: userId, type: "url", url }
                }
            } else if (activeTab === "file" && file) {
                // Validation: Check file size (10MB limit)
                if (file.size > 10 * 1024 * 1024) {
                    toast({
                        title: t('fileTooLarge'),
                        description: t('fileTooLargeDescription'),
                        variant: "destructive",
                    })
                    setIsAdding(false)
                    return
                }

                // Convert file to Base64
                const reader = new FileReader();
                const fileBase64 = await new Promise((resolve, reject) => {
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Remove data URL prefix (e.g. "data:application/pdf;base64,")
                        const base64 = result.split(',')[1];
                        resolve(base64);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                payload = {
                    chatbotId: userId,
                    type: "file",
                    fileBase64,
                    fileName: file.name
                }
            } else if (activeTab === "qa") {
                const qaContent = `Q: ${question}\nA: ${answer}`;
                // 1. Save to Firestore
                const docRef = await addDoc(collection(db, "knowledge_docs"), {
                    chatbotId: userId,
                    title: question,
                    type: "qa",
                    content: qaContent.substring(0, 200) + "...",
                    fullContent: qaContent,
                    createdAt: serverTimestamp()
                })
                docId = docRef.id
                payload = { chatbotId: userId, docId, type: "qa", text: qaContent, title: question }
            }

            // 2. Call API
            const response = await fetch("/api/knowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Failed to ingest data: " + (errorData.error || response.statusText))
            }

            const result = await response.json()

            // Save Metadata to Firestore for File (URL handled above)
            if (activeTab === "file") {
                await addDoc(collection(db, "knowledge_docs"), {
                    chatbotId: userId,
                    title: result.title || file?.name,
                    type: "file",
                    source: file?.name,
                    content: result.preview || "Parsed Content",
                    createdAt: serverTimestamp()
                })
            }

            toast({
                title: "Success",
                description: t('knowledgeAdded'),
            })

            setTitle("")
            setContent("")
            setUrl("")
            setFile(null)
            setQuestion("")
            setAnswer("")
            fetchDocs() // Refresh list
        } catch (error) {
            console.error("Error adding knowledge:", error)
            toast({
                title: "Error",
                description: t('failedToAdd'),
                variant: "destructive",
            })
        } finally {
            setIsAdding(false)
        }
    }

    const handleDelete = async (docId: string) => {
        if (!confirm(t('deleteConfirm'))) return

        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, "knowledge_docs", docId))

            // 2. Call API to delete from Pinecone (Best effort)
            // We pass docId and chatbotId to the API
            await fetch(`/api/knowledge?docId=${docId}&chatbotId=${userId}`, {
                method: "DELETE"
            })

            toast({
                title: t('deleted'),
                description: t('knowledgeDeleted'),
            })

            fetchDocs()
        } catch (error) {
            console.error("Error deleting doc:", error)
            toast({
                title: "Error",
                description: t('failedToDelete'),
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className={embedded ? "space-y-8" : "p-8 space-y-8"}>
            {!embedded && (
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('knowledgeBase')}</h2>
                    <p className="text-muted-foreground">
                        {t('trainChatbotDescription')}
                    </p>
                </div>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                {/* Left: Add New Data */}
                {embedded ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('addNewData')}</h3>
                        <Tabs defaultValue="text" className="w-full" onValueChange={(val) => setActiveTab(val)}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="text">{t('knowledgeText')}</TabsTrigger>
                                <TabsTrigger value="url">{t('knowledgeUrl')}</TabsTrigger>
                                <TabsTrigger value="file">{t('knowledgeFile')}</TabsTrigger>
                                <TabsTrigger value="qa">{t('knowledgeQa')}</TabsTrigger>
                            </TabsList>

                            {/* TEXT INPUT */}
                            <TabsContent value="text" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">{t('knowledgeTitle')}</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Return Policy"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="content">{t('knowledgeContent')}</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Enter the detailed information here..."
                                        className="h-40"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                            </TabsContent>

                            {/* URL INPUT */}
                            <TabsContent value="url" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="url">{t('websiteUrl')}</Label>
                                    <Input
                                        id="url"
                                        placeholder="https://example.com/about"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('scrapeDescription')}
                                    </p>
                                </div>
                            </TabsContent>

                            {/* FILE INPUT */}
                            <TabsContent value="file" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="file">{t('uploadDocument')}</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.txt,.xlsx,.xls,.docx"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('supportedFormats')}
                                    </p>
                                </div>
                            </TabsContent>

                            {/* Q&A INPUT */}
                            <TabsContent value="qa" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="question">{t('question')}</Label>
                                    <Input
                                        id="question"
                                        placeholder="e.g. What is your return policy?"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="answer">{t('answer')}</Label>
                                    <Textarea
                                        id="answer"
                                        placeholder="e.g. You can return items within 30 days..."
                                        className="h-32"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />
                                </div>
                            </TabsContent>

                            <Button
                                className="w-full mt-4"
                                onClick={handleAddKnowledge}
                                disabled={isAdding || (activeTab === "text" ? (!title || !content) : (activeTab === "url" ? !url : (activeTab === "file" ? !file : (!question || !answer))))}
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {activeTab === "url" ? "Scraping..." : activeTab === "file" ? "Uploading & Parsing..." : "Adding..."}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('addToKnowledgeBase')}
                                    </>
                                )}
                            </Button>
                        </Tabs>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('addNewData')}</CardTitle>
                            <CardDescription>
                                {t('trainChatbotDescription')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="text" className="w-full" onValueChange={(val) => setActiveTab(val)}>
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="text">{t('knowledgeText')}</TabsTrigger>
                                    <TabsTrigger value="url">{t('knowledgeUrl')}</TabsTrigger>
                                    <TabsTrigger value="file">{t('knowledgeFile')}</TabsTrigger>
                                    <TabsTrigger value="qa">{t('knowledgeQa')}</TabsTrigger>
                                </TabsList>

                                {/* TEXT INPUT */}
                                <TabsContent value="text" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">{t('knowledgeTitle')}</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Return Policy"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">{t('knowledgeContent')}</Label>
                                        <Textarea
                                            id="content"
                                            placeholder="Enter the detailed information here..."
                                            className="h-40"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </TabsContent>

                                {/* URL INPUT */}
                                <TabsContent value="url" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="url">{t('websiteUrl')}</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="url"
                                                placeholder="https://example.com/about"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={async () => {
                                                    if (!url) return;
                                                    setIsAdding(true);
                                                    try {
                                                        const res = await fetch('/api/crawl', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ url })
                                                        });
                                                        if (!res.ok) throw new Error('Failed to crawl');
                                                        const data = await res.json();
                                                        setTitle(data.title);
                                                        setContent(data.content);
                                                        toast({ title: "Success", description: "Content fetched successfully. Review and add." });
                                                    } catch (e) {
                                                        toast({ title: "Error", description: "Failed to fetch URL", variant: "destructive" });
                                                    } finally {
                                                        setIsAdding(false);
                                                    }
                                                }}
                                                disabled={isAdding || !url}
                                            >
                                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t('scrapeDescription')}
                                        </p>
                                    </div>
                                    {content && activeTab === 'url' && (
                                        <div className="space-y-2 border p-4 rounded-md bg-muted/50">
                                            <div className="space-y-1">
                                                <Label>Preview Title</Label>
                                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Preview Content</Label>
                                                <Textarea
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    className="h-40"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Review the content above. Click "Add to Knowledge Base" to save.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* FILE INPUT */}
                                <TabsContent value="file" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="file">{t('uploadDocument')}</Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            accept=".pdf,.txt,.xlsx,.xls,.docx"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('supportedFormats')}
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Q&A INPUT */}
                                <TabsContent value="qa" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="question">{t('question')}</Label>
                                        <Input
                                            id="question"
                                            placeholder="e.g. What is your return policy?"
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="answer">{t('answer')}</Label>
                                        <Textarea
                                            id="answer"
                                            placeholder="e.g. You can return items within 30 days..."
                                            className="h-32"
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                        />
                                    </div>
                                </TabsContent>

                                <Button
                                    className="w-full mt-4"
                                    onClick={handleAddKnowledge}
                                    disabled={isAdding || (activeTab === "text" ? (!title || !content) : (activeTab === "url" ? !url : (activeTab === "file" ? !file : (!question || !answer))))}
                                >
                                    {isAdding ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {activeTab === "url" ? "Scraping..." : activeTab === "file" ? "Uploading & Parsing..." : "Adding..."}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add to Knowledge Base
                                        </>
                                    )}
                                </Button>
                            </Tabs>
                        </CardContent>
                    </Card>
                )}

                {/* Right: List Data */}
                {embedded ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('existingKnowledge')}</h3>
                        <div className="border rounded-lg">
                            {docs.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                                    <Database className="h-10 w-10 mb-2 opacity-20" />
                                    {t('noKnowledge')}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('knowledgeTitle')}</TableHead>
                                            <TableHead className="text-right">{t('date')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {docs.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.title}</TableCell>
                                                <TableCell className="text-right text-muted-foreground text-xs">
                                                    {doc.createdAt?.seconds ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                                                </TableCell>
                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                        onClick={() => setSelectedDoc(doc)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(doc.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('existingKnowledge')}</CardTitle>
                            <CardDescription>
                                {t('existingKnowledgeDescription')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {docs.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                                    <Database className="h-10 w-10 mb-2 opacity-20" />
                                    {t('noKnowledge')}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('knowledgeTitle')}</TableHead>
                                            <TableHead className="text-right">{t('date')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {docs.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.title}</TableCell>
                                                <TableCell className="text-right text-muted-foreground text-xs">
                                                    {doc.createdAt?.seconds ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}
                                                </TableCell>
                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                        onClick={() => setSelectedDoc(doc)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(doc.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* View Content Modal */}
            <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedDoc?.title}</DialogTitle>
                        <DialogDescription>
                            Added on {selectedDoc?.createdAt?.seconds ? new Date(selectedDoc.createdAt.seconds * 1000).toLocaleDateString() : ""}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 whitespace-pre-wrap text-sm p-4 bg-muted rounded-md">
                        {selectedDoc?.fullContent || selectedDoc?.content}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
