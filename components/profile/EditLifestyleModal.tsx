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
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              name="fullName" 
              value={formData.fullName} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Age</Label>
            <Input 
              name="age" 
              type="number" 
              value={formData.age} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input 
              name="phone" 
              value={formData.phone} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Home Town</Label>
            <Input 
              name="hometown" 
              value={formData.hometown} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Relationship Status</Label>
            <Select 
              value={formData.relationshipStatus} 
              onValueChange={(value) => onSelectChange("relationshipStatus", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Looking for roommate in</Label>
            <Input 
              name="lookingIn" 
              value={formData.lookingIn} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Occupation</Label>
            <Input 
              name="occupation" 
              value={formData.occupation} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Offering room for rent?</Label>
            <Select 
              value={formData.offeringRoom} 
              onValueChange={(value) => onSelectChange("offeringRoom", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Lease Duration</Label>
            <Input 
              name="leaseDuration" 
              value={formData.leaseDuration} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Rent Budget</Label>
            <Input 
              name="maxBudget" 
              value={formData.maxBudget} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Move In Date</Label>
            <Input 
              name="moveInDate" 
              value={formData.moveInDate} 
              onChange={onInputChange} 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>About Yourself</Label>
            <Textarea 
              name="bio" 
              value={formData.bio} 
              onChange={onInputChange} 
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4 pb-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={onSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}