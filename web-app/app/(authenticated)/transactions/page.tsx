"use client"

import { useState } from "react"
import { Search, Pencil, Trash2 } from "lucide-react"
import {
  mockTransactions,
  mockCategories,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data"
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
import { cn } from "@/lib/utils"

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
}: {
  isEdit: boolean
  initial?: TransactionFormData
  open: boolean
  onClose: () => void
  onSave: (data: TransactionFormData) => void
}) {
  const [form, setForm] = useState<TransactionFormData>(
    initial || {
      amount: "",
      type: "EXPENSE",
      category: mockCategories[0].id,
      description: "",
      date: new Date().toISOString().split("T")[0],
    }
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Amount */}
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              AMOUNT
            </Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            />
          </div>

          {/* Type segmented */}
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

          {/* Category */}
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              CATEGORY
            </Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 bg-surface-2 border border-border rounded-md px-3 text-primary text-sm outline-none transition-colors focus:border-primary appearance-none"
            >
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-surface-2 text-primary">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
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

          {/* Date */}
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
          <Button onClick={() => onSave(form)}>
            Save
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
  const [editingTx, setEditingTx] = useState<string | null>(null)

  const filtered = mockTransactions.filter((tx) => {
    if (filter !== "ALL" && tx.type !== filter) return false
    if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
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
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
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

        {/* Rows */}
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
                onClick={() => { setEditingTx(tx.id); setShowModal(true) }}
                aria-label="Edit transaction"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-text-muted hover:text-primary"
                onClick={() => showToast("Transaction deleted")}
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

      <TransactionModal
        isEdit={!!editingTx}
        initial={
          editingTx
            ? (() => {
                const tx = mockTransactions.find((t) => t.id === editingTx)!
                return {
                  amount: String(tx.amount),
                  type: tx.type,
                  category: tx.category.id,
                  description: tx.description,
                  date: tx.date,
                }
              })()
            : undefined
        }
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false)
          showToast(editingTx ? "Transaction updated" : "Transaction added")
        }}
      />
    </div>
  )
}
