"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { PeriodFilter as PeriodFilterType, DateRange } from "@/types"

function getDateRange(period: Exclude<PeriodFilterType, "custom">): DateRange {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 7)
      break
    case "30d":
      start.setDate(start.getDate() - 30)
      break
    case "90d":
      start.setDate(start.getDate() - 90)
      break
  }

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  }
}

interface PeriodFilterProps {
  value: DateRange
  period: PeriodFilterType
  onChange: (range: DateRange, period: PeriodFilterType) => void
}

const periods = [
  { key: "7d" as const, label: "7D" },
  { key: "30d" as const, label: "30D" },
  { key: "90d" as const, label: "90D" },
  { key: "custom" as const, label: "Custom" },
]

export { getDateRange }

export function PeriodFilter({ value, period, onChange }: PeriodFilterProps) {
  const [customStart, setCustomStart] = useState(value.startDate)
  const [customEnd, setCustomEnd] = useState(value.endDate)

  const handlePeriodClick = (p: PeriodFilterType) => {
    if (p === "custom") {
      onChange({ startDate: customStart, endDate: customEnd }, "custom")
    } else {
      onChange(getDateRange(p), p)
    }
  }

  const handleCustomDateChange = (field: "startDate" | "endDate", val: string) => {
    if (field === "startDate") {
      setCustomStart(val)
      if (period === "custom") {
        onChange({ startDate: val, endDate: customEnd }, "custom")
      }
    } else {
      setCustomEnd(val)
      if (period === "custom") {
        onChange({ startDate: customStart, endDate: val }, "custom")
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex border border-border rounded-md overflow-hidden">
        {periods.map((p, idx) => (
          <button
            key={p.key}
            onClick={() => handlePeriodClick(p.key)}
            className={cn(
              "h-9 px-3 text-[13px] font-medium border-none cursor-pointer transition-all",
              period === p.key
                ? "bg-primary text-black"
                : "bg-surface text-muted-foreground",
              idx < periods.length - 1 && "border-r border-border"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={customStart}
            onChange={(e) => handleCustomDateChange("startDate", e.target.value)}
            className="h-9 w-[150px] bg-surface-2 border-border text-primary text-[13px] scheme-dark"
          />
          <span className="text-text-muted text-xs">to</span>
          <Input
            type="date"
            value={customEnd}
            onChange={(e) => handleCustomDateChange("endDate", e.target.value)}
            className="h-9 w-[150px] bg-surface-2 border-border text-primary text-[13px] scheme-dark"
          />
        </div>
      )}
    </div>
  )
}
