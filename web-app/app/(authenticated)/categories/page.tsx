"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus } from "lucide-react"
import { mockCategories } from "@/lib/mock-data"
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
}: {
  isEdit: boolean
  initialName?: string
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
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
          <Button onClick={() => onSave(name)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CategoriesPage() {
  const { showToast } = useToastContext()
  const [showModal, setShowModal] = useState(false)
  const [editingCat, setEditingCat] = useState<string | null>(null)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.map((cat) => (
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
                onClick={() => { setEditingCat(cat.id); setShowModal(true) }}
                aria-label="Edit category"
              >
                <Pencil size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-text-muted hover:text-primary"
                onClick={() => showToast("Category deleted")}
                aria-label="Delete category"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        ))}

        {/* Add new card */}
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
        initialName={editingCat ? mockCategories.find((c) => c.id === editingCat)?.name : undefined}
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
          setShowModal(false)
          showToast(editingCat ? "Category updated" : "Category added")
        }}
      />
    </div>
  )
}
