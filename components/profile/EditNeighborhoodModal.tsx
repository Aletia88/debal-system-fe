"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function EditLifestyleModal({
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
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lifestyle Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Cleanliness</Label>
            <Select 
              value={formData.cleanliness} 
              onValueChange={(value) => onSelectChange("cleanliness", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cleanliness level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very neat">Very neat</SelectItem>
                <SelectItem value="Neat">Neat</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Messy">Messy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Work/School Hours</Label>
            <Input 
              name="workHours" 
              value={formData.workHours} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Sleeping Hours</Label>
            <Input 
              name="sleepHours" 
              value={formData.sleepHours} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Tobacco Use</Label>
            <Select 
              value={formData.tobacco} 
              onValueChange={(value) => onSelectChange("tobacco", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tobacco use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regularly">Regularly</SelectItem>
                <SelectItem value="Socially">Socially</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Alcohol Use</Label>
            <Select 
              value={formData.alcohol} 
              onValueChange={(value) => onSelectChange("alcohol", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alcohol use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regularly">Regularly</SelectItem>
                <SelectItem value="Socially">Socially</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Drug Use</Label>
            <Select 
              value={formData.drugs} 
              onValueChange={(value) => onSelectChange("drugs", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select drug use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regularly">Regularly</SelectItem>
                <SelectItem value="Socially">Socially</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cooking Frequency</Label>
            <Select 
              value={formData.cooking} 
              onValueChange={(value) => onSelectChange("cooking", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cooking frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Often">Often</SelectItem>
                <SelectItem value="Sometimes">Sometimes</SelectItem>
                <SelectItem value="Rarely">Rarely</SelectItem>
                <SelectItem value="Never">Never</SelectItem>
              </SelectContent>
            </Select>
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