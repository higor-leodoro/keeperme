"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useGetBalance } from "@/hooks/queries"
import { useGetTransactions } from "@/hooks/queries"
import { useGetTransactionAllCategories } from "@/hooks/queries"
import { cn, formatCurrency } from "@/lib/utils"

function BalanceCards() {
  const { data: balance, isLoading } = useGetBalance()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-6 animate-pulse">
            <div className="h-3 w-24 bg-surface-3 rounded mb-3" />
            <div className="h-9 w-32 bg-surface-3 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL BALANCE
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(balance?.totalBalance || 0)}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL INCOME
          <TrendingUp size={16} className="text-muted-foreground" />
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(balance?.totalIncome || 0)}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL EXPENSES
          <TrendingDown size={16} className="text-muted-foreground" />
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(balance?.totalExpense || 0)}
        </div>
      </div>
    </div>
  )
}

function SpendingByCategory() {
  const { data: categories, isLoading } = useGetTransactionAllCategories()

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex items-center justify-center h-[200px]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  const spending = (categories || []).map((c) => ({
    name: c.categoryName,
    amount: c.total,
  }))

  const maxAmount = Math.max(...spending.map((c) => c.amount), 1)

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-5">
        SPENDING BY CATEGORY
      </div>
      {spending.length === 0 ? (
        <div className="text-sm text-muted-foreground">No spending data yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {spending.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="shrink-0 text-sm text-foreground w-[120px]">
                {cat.name}
              </span>
              <div className="flex-1 h-1 bg-surface-3 rounded-sm overflow-hidden">
                <div
                  className="bar-animate h-full bg-primary rounded-sm"
                  style={{
                    width: maxAmount > 0 ? `${(cat.amount / maxAmount) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="shrink-0 text-sm font-semibold text-primary w-[60px] text-right">
                {formatCurrency(cat.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RecentTransactions() {
  const { data: transactions, isLoading } = useGetTransactions()

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 flex items-center justify-center h-[200px]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  const recent = (transactions || []).slice(0, 5)

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-5">
        RECENT TRANSACTIONS
      </div>
      {recent.length === 0 ? (
        <div className="text-sm text-muted-foreground">No transactions yet</div>
      ) : (
        <div className="flex flex-col">
          {recent.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between h-12 border-b border-border"
            >
              <div>
                <div className="text-[13px] text-muted-foreground">
                  {tx.category.name}
                </div>
                <div className="text-sm text-foreground">
                  {tx.description}
                </div>
              </div>
              <div
                className={cn(
                  "text-[15px] font-semibold",
                  tx.type === "INCOME" ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tx.type === "INCOME" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        href="/transactions"
        className="block text-[13px] text-text-muted mt-4 no-underline transition-colors hover:text-primary"
      >
        {"View all transactions \u2192"}
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <BalanceCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SpendingByCategory />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>
    </div>
  )
}
