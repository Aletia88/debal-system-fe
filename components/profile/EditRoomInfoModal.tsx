"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function EditRoomInfoModal({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSelectChange,
  onArrayChange,
  onSave
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: any
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: string, value: string) => void
  onArrayChange: (name: string, value: string[]) => void
  onSave: () => void
}) {
  const amenitiesList = [
    "Running Water",
    "Electricity",
    "Solar Inverter",
    "WiFi",
    "Parking",
    "Security",
    "Gym",
    "Pool"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Room Information</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>House Location</Label>
            <Input 
              name="houseLocation" 
              value={formData.houseLocation} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Apartment Type</Label>
            <Select 
              value={formData.apartmentType} 
              onValueChange={(value) => onSelectChange("apartmentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select apartment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Duplex">Duplex</SelectItem>
                <SelectItem value="Bungalow">Bungalow</SelectItem>
                <SelectItem value="Shared Room">Shared Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Area/Neighborhood Name</Label>
            <Input 
              name="areaName" 
              value={formData.areaName} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Furniture</Label>
            <Select 
              value={formData.furniture} 
              onValueChange={(value) => onSelectChange("furniture", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select furniture status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                <SelectItem value="Partially Furnished">Partially Furnished</SelectItem>
                <SelectItem value="Unfurnished">Unfurnished</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Number of Bedrooms</Label>
            <Input 
              name="bedrooms" 
              type="number" 
              value={formData.bedrooms} 
              onChange={onInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label>Number of Bathrooms</Label>
            <Input 
              name="bathrooms" 
              type="number" 
              value={formData.bathrooms} 
              onChange={onInputChange} 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Switch 
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      const newAmenities = checked
                        ? [...formData.amenities, amenity]
                        : formData.amenities.filter((a: string) => a !== amenity)
                      onArrayChange("amenities", newAmenities)
                    }}
                  />
                  <Label>{amenity}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Room Information</Label>
            <Textarea 
              name="roomInfo" 
              value={formData.roomInfo} 
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