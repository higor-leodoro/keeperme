"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Pencil, Trash2, X, UserMinus, ArrowLeftRight, Loader2 } from "lucide-react"
import {
  useGetGroup,
  useGetGroupTransactions,
  useGetGroupInvites,
  useGetMe,
  useGetCategories,
  useGetPendingInvites,
} from "@/hooks/queries"
import {
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
  useCreateGroupInvite,
  useDeleteGroupInvite,
  useRemoveGroupMember,
  useAcceptInvite,
  useRejectInvite,
  useDeleteGroup,
} from "@/hooks/mutations"
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
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { Transaction } from "@/types"

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">AMOUNT</Label>
            <CurrencyInput
              value={parseFloat(form.amount) || 0}
              onChange={(val) => setForm({ ...form, amount: String(val) })}
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
              <option value="">Select a category</option>
              {(categories || []).map((cat) => (
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
          <Button onClick={() => onSave(form)} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.id as string
  const { showToast } = useToastContext()
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")

  const { data: group, isLoading: groupLoading } = useGetGroup(groupId)
  const { data: transactions } = useGetGroupTransactions(groupId)
  const { data: invites } = useGetGroupInvites(groupId)
  const { data: pendingInvites } = useGetPendingInvites()
  const { data: user } = useGetMe()

  const userMember = group?.members.find((m) => m.user.id === user?.id)
  const isOwner = userMember?.role === "OWNER"

  const groupPendingInvites = (pendingInvites || []).filter(
    (inv) => inv.group?.id === groupId
  )

  const createTxMutation = useCreateTransaction({
    onSuccess: () => {
      setShowModal(false)
      showToast("Transaction added")
    },
    onError: (error) => showToast(error.message),
  })

  const updateTxMutation = useUpdateTransaction({
    onSuccess: () => {
      setShowModal(false)
      setEditingTx(null)
      showToast("Transaction updated")
    },
    onError: (error) => showToast(error.message),
  })

  const deleteTxMutation = useDeleteTransaction({
    onSuccess: () => showToast("Transaction deleted"),
    onError: (error) => showToast(error.message),
  })

  const createInviteMutation = useCreateGroupInvite({
    onSuccess: () => {
      setInviteEmail("")
      showToast("Invite sent")
    },
    onError: (error) => showToast(error.message),
  })

  const deleteInviteMutation = useDeleteGroupInvite({
    onSuccess: () => showToast("Invite cancelled"),
    onError: (error) => showToast(error.message),
  })

  const removeMemberMutation = useRemoveGroupMember({
    onSuccess: () => showToast("Member removed"),
    onError: (error) => showToast(error.message),
  })

  const acceptInviteMutation = useAcceptInvite({
    onSuccess: () => showToast("Invite accepted"),
    onError: (error) => showToast(error.message),
  })

  const rejectInviteMutation = useRejectInvite({
    onSuccess: () => showToast("Invite rejected"),
    onError: (error) => showToast(error.message),
  })

  const deleteGroupMutation = useDeleteGroup({
    onSuccess: () => {
      showToast("Group deleted")
      window.location.href = "/groups"
    },
    onError: (error) => showToast(error.message),
  })

  const handleSaveTx = (data: TransactionFormData) => {
    const payload = {
      amount: parseFloat(data.amount),
      type: data.type,
      categoryId: data.category,
      description: data.description,
      date: data.date,
      groupId,
    }

    if (editingTx) {
      updateTxMutation.mutate({ id: editingTx.id, data: payload })
    } else {
      createTxMutation.mutate(payload)
    }
  }

  if (groupLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        Group not found
      </div>
    )
  }

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteGroupMutation.mutate(groupId)}
              disabled={group.transactionCount > 0 || deleteGroupMutation.isPending}
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
            <Button variant="outline" size="sm" onClick={() => { setEditingTx(null); setShowModal(true) }}>
              + Add Transaction
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-[90px_1fr_120px_100px_100px_60px] h-10 items-center px-4 bg-surface-2">
              {["DATE", "DESCRIPTION", "CATEGORY", "ADDED BY", "AMOUNT", ""].map((h) => (
                <span key={h} className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted">{h}</span>
              ))}
            </div>

            {(transactions || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-text-muted">
                <ArrowLeftRight size={24} className="mb-2 text-text-muted" />
                <span className="text-sm">No transactions in this group yet</span>
              </div>
            ) : (
              (transactions || []).map((tx) => (
                <div
                  key={tx.id}
                  className="group grid grid-cols-[90px_1fr_120px_100px_100px_60px] h-13 items-center px-4 border-b border-border transition-colors hover:bg-surface cursor-default"
                >
                  <span className="text-[13px] text-muted-foreground">{formatDate(tx.date)}</span>
                  <span className="text-sm text-foreground">{tx.description}</span>
                  <span className="text-[13px] text-text-muted">{tx.category.name}</span>
                  <span className="text-xs text-muted-foreground">{tx.user?.name || "—"}</span>
                  <span className={cn(
                    "text-[15px] font-semibold",
                    tx.type === "INCOME" ? "text-primary" : "text-muted-foreground"
                  )}>
                    {tx.type === "INCOME" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon-sm" className="text-text-muted hover:text-primary" onClick={() => { setEditingTx(tx); setShowModal(true) }} aria-label="Edit">
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-text-muted hover:text-primary" onClick={() => deleteTxMutation.mutate(tx.id)} aria-label="Delete">
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
                      {isOwner && member.user.id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-text-muted hover:text-primary"
                          onClick={() => removeMemberMutation.mutate({ groupId, userId: member.user.id })}
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
                  onClick={() => createInviteMutation.mutate({ groupId, email: inviteEmail })}
                  disabled={!inviteEmail || createInviteMutation.isPending}
                  className="whitespace-nowrap"
                >
                  Send Invite
                </Button>
              </div>
              {(invites || []).length > 0 && (
                <div className="text-[13px] text-muted-foreground">
                  {(invites || []).map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between py-2 border-b border-border">
                      <div>
                        <span className="text-foreground">{invite.email}</span>
                        <span className="mx-2 text-text-muted"> - </span>
                        <Badge variant="secondary" className="text-[11px]">{invite.status}</Badge>
                        <span className="mx-2 text-text-muted"> - </span>
                        <span className="text-text-muted text-xs">expires {formatDate(invite.expiresAt)}</span>
                      </div>
                      {invite.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-text-muted hover:text-primary"
                          onClick={() => deleteInviteMutation.mutate({ groupId, inviteId: invite.id })}
                          aria-label="Cancel invite"
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending invitations (for member) */}
          {!isOwner && groupPendingInvites.length > 0 && (
            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-text-muted mb-4">
                PENDING INVITATIONS
              </div>
              {groupPendingInvites.map((invite) => (
                <div key={invite.id} className="mb-3">
                  <p className="text-sm text-foreground mb-2">
                    {invite.invitedByUser?.name} invited you to join {invite.group?.name}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptInviteMutation.mutate(invite.token)} disabled={acceptInviteMutation.isPending}>
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => rejectInviteMutation.mutate(invite.token)} disabled={rejectInviteMutation.isPending}>
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
        onSave={handleSaveTx}
        isPending={createTxMutation.isPending || updateTxMutation.isPending}
      />
    </div>
  )
}
