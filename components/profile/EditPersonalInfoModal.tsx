"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function EditPersonalInfoModal({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSelectChange,
  onSave
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: any
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string) => void
  onSave: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Personal Information</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Form fields */}
          {/* ... */}
        </div>
        <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4 pb-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={onSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}