import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface KpiWidgetProps {
  title: string
  value: string
  trend?: string
  positive?: boolean
}

export function KpiWidget({ title, value, trend, positive = true }: KpiWidgetProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
            {positive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}
