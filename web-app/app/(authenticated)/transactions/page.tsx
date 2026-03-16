"use client"

import { useState } from "react"
import { Search, Pencil, Trash2, Loader2 } from "lucide-react"
import { useGetTransactions, useGetCategories } from "@/hooks/queries"
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from "@/hooks/mutations"
import { useToastContext } from "@/components/toast-provider"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CurrencyInput } from "@/components/currency-input"
import { PeriodFilter, getDateRange } from "@/components/period-filter"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { Transaction, DateRange, PeriodFilter as PeriodFilterType } from "@/types"

type TransactionType = "INCOME" | "EXPENSE"
type FilterType = "ALL" | "INCOME" | "EXPENSE"

interface TransactionFormData {
  amount: string
  type: TransactionType
  category: string
  description: string
  date: string
}

function TransactionModal({
  isEdit,
  initial,
  open,
  onClose,
  onSave,
  isPending,
}: {
  isEdit: boolean
  initial?: TransactionFormData
  open: boolean
  onClose: () => void
  onSave: (data: TransactionFormData) => void
  isPending?: boolean
}) {
  const { data: categories } = useGetCategories()
  const [form, setForm] = useState<TransactionFormData>(
    initial || {
      amount: "",
      type: "EXPENSE",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    }
  )

  const categoryList = categories || []

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              AMOUNT
            </Label>
            <CurrencyInput
              value={parseFloat(form.amount) || 0}
              onChange={(val) => setForm({ ...form, amount: String(val) })}
            />
          </div>

          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              TYPE
            </Label>
            <div className="flex border border-border rounded-md overflow-hidden">
              {(["INCOME", "EXPENSE"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={cn(
                    "flex-1 h-10 text-[13px] font-medium border-none cursor-pointer transition-all",
                    form.type === t
                      ? "bg-primary text-black"
                      : "bg-surface text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              CATEGORY
            </Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 bg-surface-2 border border-border rounded-md px-3 text-primary text-sm outline-none transition-colors focus:border-primary appearance-none"
            >
              <option value="">Select a category</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-surface-2 text-primary">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              DESCRIPTION
            </Label>
            <Input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            />
          </div>

          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              DATE
            </Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary scheme-dark"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form)} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TransactionsPage() {
  const { showToast } = useToastContext()
  const [filter, setFilter] = useState<FilterType>("ALL")
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [period, setPeriod] = useState<PeriodFilterType>("30d")
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange("30d"))

  const { data: transactions, isLoading } = useGetTransactions(dateRange)

  const createMutation = useCreateTransaction({
    onSuccess: () => {
      setShowModal(false)
      showToast("Transaction added")
    },
    onError: (error) => showToast(error.message),
  })

  const updateMutation = useUpdateTransaction({
    onSuccess: () => {
      setShowModal(false)
      setEditingTx(null)
      showToast("Transaction updated")
    },
    onError: (error) => showToast(error.message),
  })

  const deleteMutation = useDeleteTransaction({
    onSuccess: () => showToast("Transaction deleted"),
    onError: (error) => showToast(error.message),
  })

  const filtered = (transactions || []).filter((tx) => {
    if (filter !== "ALL" && tx.type !== filter) return false
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleSave = (data: TransactionFormData) => {
    const payload = {
      amount: parseFloat(data.amount),
      type: data.type,
      categoryId: data.category,
      description: data.description,
      date: data.date,
    }

    if (editingTx) {
      updateMutation.mutate({ id: editingTx.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div>
      {/* Filters bar */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <PeriodFilter
            value={dateRange}
            period={period}
            onChange={(range, p) => { setDateRange(range); setPeriod(p) }}
          />

          <div className="flex border border-border rounded-md overflow-hidden">
            {(["ALL", "INCOME", "EXPENSE"] as const).map((f, idx) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-9 px-4 text-[13px] font-medium border-none cursor-pointer transition-all",
                  filter === f
                    ? "bg-primary text-black"
                    : "bg-surface text-muted-foreground",
                  idx < 2 && "border-r border-border"
                )}
              >
                {f === "ALL" ? "All" : f === "INCOME" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] bg-surface-2 border-border text-primary text-[13px] pl-8 focus:border-primary"
            />
          </div>
          <Button size="sm" onClick={() => { setEditingTx(null); setShowModal(true) }} className="whitespace-nowrap">
            + Add Transaction
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[100px_1fr_140px_100px_120px_80px] h-10 items-center px-5 bg-surface-2">
            {["DATE", "DESCRIPTION", "CATEGORY", "TYPE", "AMOUNT", ""].map((h) => (
              <span
                key={h}
                className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted"
              >
                {h}
              </span>
            ))}
          </div>

          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="group grid grid-cols-[100px_1fr_140px_100px_120px_80px] h-13 items-center px-5 border-b border-border transition-colors hover:bg-surface cursor-default"
            >
              <span className="text-[13px] text-muted-foreground">
                {formatDate(tx.date)}
              </span>
              <span className="text-sm text-foreground">
                {tx.description}
              </span>
              <span className="text-[13px] text-text-muted">
                {tx.category.name}
              </span>
              <span>
                <Badge variant={tx.type === "INCOME" ? "outline" : "secondary"}>
                  {tx.type}
                </Badge>
              </span>
              <span
                className={cn(
                  "text-[15px] font-semibold",
                  tx.type === "INCOME" ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tx.type === "INCOME" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </span>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-text-muted hover:text-primary"
                  onClick={() => { setEditingTx(tx); setShowModal(true) }}
                  aria-label="Edit transaction"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-text-muted hover:text-primary"
                  onClick={() => deleteMutation.mutate(tx.id)}
                  aria-label="Delete transaction"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-[120px] text-text-muted text-sm">
              No transactions found
            </div>
          )}
        </div>
      )}

      <TransactionModal
        isEdit={!!editingTx}
        initial={
          editingTx
            ? {
                amount: String(editingTx.amount),
                type: editingTx.type,
                category: editingTx.categoryId || editingTx.category.id,
                description: editingTx.description,
                date: editingTx.date,
              }
            : undefined
        }
        open={showModal}
        onClose={() => { setShowModal(false); setEditingTx(null) }}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
