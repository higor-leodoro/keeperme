"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Pencil, Trash2, X, UserMinus } from "lucide-react"
import {
  mockGroups,
  mockGroupTransactions,
  mockInvites,
  mockUser,
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
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">AMOUNT</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            />
          </div>
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">TYPE</Label>
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
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">CATEGORY</Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-11 bg-surface-2 border border-border rounded-md px-3 text-primary text-sm outline-none appearance-none"
            >
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-surface-2 text-primary">{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">DESCRIPTION</Label>
            <Input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            />
          </div>
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">DATE</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-11 bg-surface-2 border-border text-primary text-sm scheme-dark"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function GroupDetailPage() {
  const params = useParams()
  const { showToast } = useToastContext()
  const [showModal, setShowModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  const group = mockGroups.find((g) => g.id === params.id) || mockGroups[0]
  const userMember = group.members.find((m) => m.user.id === mockUser.id)
  const isOwner = userMember?.role === "OWNER"
  const transactions = mockGroupTransactions.filter((t) => t.groupId === group.id)

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-primary m-0">
              {group.name}
            </h1>
            <Badge variant={isOwner ? "default" : "secondary"}>
              {userMember?.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground m-0">
            {group.description}
          </p>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Edit Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={group.transactionCount > 0}
              title={group.transactionCount > 0 ? "Cannot delete group with transactions" : undefined}
            >
              Delete Group
            </Button>
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Transactions */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted">
              GROUP TRANSACTIONS
            </span>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              + Add Transaction
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[90px_1fr_120px_100px_100px_60px] h-10 items-center px-4 bg-surface-2">
              {["DATE", "DESCRIPTION", "CATEGORY", "ADDED BY", "AMOUNT", ""].map((h) => (
                <span key={h} className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted">{h}</span>
              ))}
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-text-muted">
                <ArrowLeftRight size={24} className="mb-2 text-text-muted" />
                <span className="text-sm">No transactions in this group yet</span>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="group grid grid-cols-[90px_1fr_120px_100px_100px_60px] h-13 items-center px-4 border-b border-border transition-colors hover:bg-surface cursor-default"
                >
                  <span className="text-[13px] text-muted-foreground">{formatDate(tx.date)}</span>
                  <span className="text-sm text-foreground">{tx.description}</span>
                  <span className="text-[13px] text-text-muted">{tx.category.name}</span>
                  <span className="text-xs text-muted-foreground">{tx.addedBy}</span>
                  <span className={cn(
                    "text-[15px] font-semibold",
                    tx.type === "INCOME" ? "text-primary" : "text-muted-foreground"
                  )}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon-sm" className="text-text-muted hover:text-primary" onClick={() => showToast("Transaction updated")} aria-label="Edit">
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-text-muted hover:text-primary" onClick={() => showToast("Transaction deleted")} aria-label="Delete">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right — Members & Invites */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Members */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-4">
              MEMBERS
            </div>
            <div className="flex flex-col">
              {group.members.map((member, idx) => {
                const initials = member.user.name.split(" ").map((n) => n[0]).join("")
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between h-14",
                      idx < group.members.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center shrink-0 size-9 rounded-full bg-surface-3 text-[13px] font-semibold text-primary">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-primary">{member.user.name}</div>
                        <div className="text-xs text-text-muted">{member.user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === "OWNER" ? "default" : "secondary"}>
                        {member.role}
                      </Badge>
                      {isOwner && member.user.id !== mockUser.id && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-text-muted hover:text-primary"
                          onClick={() => showToast("Member removed")}
                          aria-label="Remove member"
                        >
                          <UserMinus size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Invites (owner) */}
          {isOwner && (
            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-4">
                INVITES
              </div>
              <div className="flex gap-2 mb-4">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 h-9 bg-surface-2 border-border text-primary text-[13px] focus:border-primary"
                />
                <Button
                  size="sm"
                  onClick={() => { setInviteEmail(""); showToast("Invite sent") }}
                  className="whitespace-nowrap"
                >
                  Send Invite
                </Button>
              </div>
              <div className="text-[13px] text-muted-foreground">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <span className="text-foreground">sam@email.com</span>
                    <span className="mx-2 text-text-muted"> - </span>
                    <Badge variant="secondary" className="text-[11px]">PENDING</Badge>
                    <span className="mx-2 text-text-muted"> - </span>
                    <span className="text-text-muted text-xs">expires Mar 1</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-text-muted hover:text-primary"
                    onClick={() => showToast("Invite cancelled")}
                    aria-label="Cancel invite"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pending invitations (for member) */}
          {!isOwner && mockInvites.length > 0 && (
            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-4">
                PENDING INVITATIONS
              </div>
              {mockInvites.map((invite) => (
                <div key={invite.id} className="mb-3">
                  <p className="text-sm text-foreground mb-2">
                    {invite.invitedByUser.name} invited you to join {invite.group.name}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => showToast("Invite accepted")}>
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => showToast("Invite rejected")}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        isEdit={false}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false)
          showToast("Transaction added")
        }}
      />
    </div>
  )
}

function ArrowLeftRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" />
    </svg>
  )
}
