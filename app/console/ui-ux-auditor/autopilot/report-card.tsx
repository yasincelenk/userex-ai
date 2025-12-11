import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Clock, RotateCcw, FileText } from "lucide-react"

interface ReportCardProps {
    metrics: {
        total: number
        passed: number
        failed: number
        duration: string
    }
    insight: string
    onRetry: () => void
}

export function ReportCard({ metrics, insight, onRetry }: ReportCardProps) {
    const successRate = Math.round((metrics.passed / metrics.total) * 100) || 0

    return (
        <Card className="bg-slate-50 border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span>Test Execution Report</span>
                    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {metrics.duration}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border text-center">
                        <div className="text-2xl font-bold flex items-center justify-center gap-2">
                            {successRate}%
                            {successRate === 100 ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertTriangle className="text-amber-500 w-5 h-5" />}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Success Rate</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border text-center">
                        <div className="text-2xl font-bold text-green-600">{metrics.passed}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Passed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border text-center">
                        <div className="text-2xl font-bold text-red-500">{metrics.failed}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Failed</div>
                    </div>
                </div>

                {/* AI Insight Section */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                        <span className="text-xl">🤖</span> AI Insight
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        {insight}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="w-4 h-4" /> View Full Logs
                    </Button>
                    <Button size="sm" className="gap-2" onClick={onRetry}>
                        <RotateCcw className="w-4 h-4" /> Retry Failed
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
