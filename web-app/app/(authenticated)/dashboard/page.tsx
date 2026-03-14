"use client"

import Link from "next/link"
import { TrendingUp, TrendingDown } from "lucide-react"
import {
  mockBalance,
  mockTransactions,
  mockSpendingByCategory,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function BalanceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Balance */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL BALANCE
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(mockBalance.totalBalance)}
        </div>
        <div className="text-xs text-text-muted mt-2">
          +$450 this month
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL INCOME
          <TrendingUp size={16} className="text-muted-foreground" />
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(mockBalance.totalIncome)}
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-2">
          TOTAL EXPENSES
          <TrendingDown size={16} className="text-muted-foreground" />
        </div>
        <div className="text-4xl font-bold text-primary tracking-tight leading-none">
          {formatCurrency(mockBalance.totalExpense)}
        </div>
      </div>
    </div>
  )
}

function SpendingByCategory() {
  const maxAmount = Math.max(...mockSpendingByCategory.map((c) => c.amount))

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-5">
        SPENDING BY CATEGORY
      </div>
      <div className="flex flex-col gap-4">
        {mockSpendingByCategory.map((cat) => (
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
    </div>
  )
}

function RecentTransactions() {
  const recent = mockTransactions.slice(0, 5)

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-5">
        RECENT TRANSACTIONS
      </div>
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
