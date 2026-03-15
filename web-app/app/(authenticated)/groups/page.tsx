"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, ArrowLeftRight, Loader2 } from "lucide-react"
import { useGetGroups, useGetPendingInvites, useGetMe } from "@/hooks/queries"
import { useCreateGroup, useAcceptInvite, useRejectInvite } from "@/hooks/mutations"
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
import { EditPermission } from "@/types"

function CreateGroupModal({
  open,
  onClose,
  onSave,
  isPending,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: { name: string; description: string; editPermission: EditPermission }) => void
  isPending?: boolean
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [permission, setPermission] = useState<EditPermission>("OWN_TRANSACTIONS_ONLY")

  const permissionOptions = [
    { value: "OWNER_ONLY" as const, label: "Owner Only", desc: "Only the group owner can add or edit transactions" },
    { value: "ALL_MEMBERS" as const, label: "All Members", desc: "All members can add and edit any transaction" },
    { value: "OWN_TRANSACTIONS_ONLY" as const, label: "Own Transactions Only", desc: "Members can only edit their own transactions" },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">NAME</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            />
          </div>
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">DESCRIPTION</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this group"
              rows={3}
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-2.5 text-primary text-sm outline-none transition-colors focus:border-primary resize-none"
            />
          </div>
          <div>
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">EDIT PERMISSION</Label>
            <div className="flex flex-col gap-2">
              {permissionOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPermission(opt.value)}
                  className={cn(
                    "text-left px-3.5 py-3 rounded-md cursor-pointer transition-all",
                    permission === opt.value
                      ? "bg-surface-3 border border-primary"
                      : "bg-surface-2 border border-border"
                  )}
                >
                  <div className="text-sm font-medium text-primary mb-0.5">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave({ name, description, editPermission: permission })} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function GroupsPage() {
  const { showToast } = useToastContext()
  const [showModal, setShowModal] = useState(false)

  const { data: groups, isLoading } = useGetGroups()
  const { data: pendingInvites } = useGetPendingInvites()
  const { data: user } = useGetMe()

  const createGroupMutation = useCreateGroup({
    onSuccess: () => {
      setShowModal(false)
      showToast("Group created")
    },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      {/* Invites banner */}
      {(pendingInvites?.length || 0) > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {pendingInvites!.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-6 py-4">
              <span className="text-sm text-foreground">
                {invite.invitedByUser?.name} invited you to join <strong>{invite.group?.name}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptInviteMutation.mutate(invite.token)}
                  disabled={acceptInviteMutation.isPending}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => rejectInviteMutation.mutate(invite.token)}
                  disabled={rejectInviteMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header with Create button */}
      <div className="flex items-center justify-end mb-6">
        <Button size="sm" onClick={() => setShowModal(true)}>
          + Create Group
        </Button>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(groups || []).map((group) => {
          const userMember = group.members.find((m) => m.user.id === user?.id)
          const role = userMember?.role || "MEMBER"

          return (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="no-underline"
            >
              <div className="bg-surface border border-border rounded-lg p-6 cursor-pointer transition-colors hover:border-muted-foreground">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold text-primary">
                    {group.name}
                  </span>
                  <Badge variant={role === "OWNER" ? "default" : "secondary"}>
                    {role}
                  </Badge>
                </div>

                <p className="text-[13px] text-muted-foreground mb-3">
                  {group.description}
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1 text-[13px] text-text-muted">
                    <Users size={14} />
                    {group.members.length} members
                  </span>
                  <span className="flex items-center gap-1 text-[13px] text-text-muted">
                    <ArrowLeftRight size={14} />
                    {group.transactionCount} transactions
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {group.editPermission.replace(/_/g, " ").toLowerCase()}
                  </span>
                  <span className="text-[13px] text-text-muted">
                    {"View group \u2192"}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {(groups || []).length === 0 && (
        <div className="flex items-center justify-center h-[120px] text-text-muted text-sm">
          No groups yet. Create one to get started!
        </div>
      )}

      <CreateGroupModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={(data) => createGroupMutation.mutate(data)}
        isPending={createGroupMutation.isPending}
      />
    </div>
  )
}
