"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { useGetCategories } from "@/hooks/queries"
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/mutations"
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

function CategoryModal({
  isEdit,
  initialName,
  open,
  onClose,
  onSave,
  isPending,
}: {
  isEdit: boolean
  initialName?: string
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
  isPending?: boolean
}) {
  const [name, setName] = useState(initialName || "")

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-surface border-border sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <div>
          <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
            NAME
          </Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(name)} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CategoriesPage() {
  const { showToast } = useToastContext()
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null)

  const { data: categories, isLoading } = useGetCategories()

  const createMutation = useCreateCategory({
    onSuccess: () => {
      setShowModal(false)
      showToast("Category added")
    },
    onError: (error) => showToast(error.message),
  })

  const updateMutation = useUpdateCategory({
    onSuccess: () => {
      setShowModal(false)
      setEditingCat(null)
      showToast("Category updated")
    },
    onError: (error) => showToast(error.message),
  })

  const deleteMutation = useDeleteCategory({
    onSuccess: () => showToast("Category deleted"),
    onError: (error) => showToast(error.message),
  })

  const handleSave = (name: string) => {
    if (editingCat) {
      updateMutation.mutate({ id: editingCat.id, name })
    } else {
      createMutation.mutate({ name })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(categories || []).map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between bg-surface border border-border rounded-lg px-6 py-5"
          >
            <span className="text-[15px] font-medium text-primary">
              {cat.name}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-text-muted hover:text-primary"
                onClick={() => { setEditingCat(cat); setShowModal(true) }}
                aria-label="Edit category"
              >
                <Pencil size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-text-muted hover:text-primary"
                onClick={() => deleteMutation.mutate(cat.id)}
                aria-label="Delete category"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}

        <button
          onClick={() => { setEditingCat(null); setShowModal(true) }}
          className="flex flex-col items-center justify-center bg-transparent border border-dashed border-border rounded-lg px-6 py-5 cursor-pointer transition-colors hover:border-muted-foreground min-h-16"
        >
          <Plus size={20} className="text-text-muted mb-1" />
          <span className="text-[13px] text-text-muted">Add category</span>
        </button>
      </div>

      <CategoryModal
        isEdit={!!editingCat}
        initialName={editingCat?.name}
        open={showModal}
        onClose={() => { setShowModal(false); setEditingCat(null) }}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
