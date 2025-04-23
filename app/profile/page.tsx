"use client"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram, Check, Pencil, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  // State for each modal
  const [personalInfoModal, setPersonalInfoModal] = useState(false)
  const [lifestyleModal, setLifestyleModal] = useState(false)
  const [neighborhoodModal, setNeighborhoodModal] = useState(false)
  const [roomInfoModal, setRoomInfoModal] = useState(false)

  // Form states (simplified for example)
  const [formData, setFormData] = useState({
    fullName: "Ruth Ismail Uzuvehe",
    age: "24",
    email: "Abubakaruzuvehe@gmail.com",
    phone: "+2519455565578",
    hometown: "Addis Ababa",
    relationshipStatus: "Single",
    lookingIn: "Addis Ababa",
    occupation: "Region",
    offeringRoom: "No",
    leaseDuration: "6 Months",
    maxBudget: "NGN100,000",
    moveInDate: "September 2021",
    bio: "Nunc nulla tincidunt quis tincidunt tellus, tellus. Iaculis eu, convallis porttitor accumsan. Risus arcu, volutpat amet sit morbi.",
    cleanliness: "Neat",
    workHours: "9-5",
    sleepHours: "11pm-7am",
    tobacco: "Never",
    alcohol: "Socially",
    drugs: "Never",
    cooking: "Sometimes",
    city: "Addis Ababa",
    neighborhoods: ["Gidan Kwano", "Gidan Kwano", "Gidan Kwano"],
    houseLocation: "City Center",
    apartmentType: "Flat",
    areaName: "Downtown",
    furniture: "Fully Furnished",
    bedrooms: "3",
    bathrooms: "2",
    amenities: ["Running Water", "Electricity", "Solar Inverter"],
    roomInfo: "Spacious room with natural light and built-in storage."
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name: string, value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Profile Header */}
      <div className="bg-white py-6 px-4 text-center">
        <h1 className="text-2xl font-bold text-purple-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Holla!, Fill in the details to complete sign up</p>
        <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md">Edit Profile</Button>
      </div>

      {/* Profile Banner */}
      <div className="bg-purple-900 py-12 px-4 text-center text-white relative">
        <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
            <AvatarFallback>RU</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">{formData.fullName}</h2>
          <p className="text-purple-200 text-sm">NGN20000/year</p>

          <div className="flex justify-center mt-4 space-x-4">
            <button className="bg-purple-800 p-2 rounded-full hover:bg-purple-700">
              <Twitter size={20} />
            </button>
            <button className="bg-purple-800 p-2 rounded-full hover:bg-purple-700">
              <Facebook size={20} />
            </button>
            <button className="bg-purple-800 p-2 rounded-full hover:bg-purple-700">
              <Instagram size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Personal Information
                <span className="ml-2 text-green-500">
                  <Check size={16} />
                </span>
              </h3>
              <button 
                className="text-purple-600 hover:text-purple-800"
                onClick={() => setPersonalInfoModal(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.fullName}</h4>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.age}</h4>
                  <p className="text-sm text-gray-500">Age</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.email}</h4>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.phone}</h4>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.hometown}</h4>
                  <p className="text-sm text-gray-500">Home Town</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.relationshipStatus}</h4>
                  <p className="text-sm text-gray-500">Relationship Status</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.lookingIn}</h4>
                  <p className="text-sm text-gray-500">Where are you looking for roommate</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.occupation}</h4>
                  <p className="text-sm text-gray-500">Occupation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.offeringRoom}</h4>
                  <p className="text-sm text-gray-500">Are you offering room for rent</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.leaseDuration}</h4>
                  <p className="text-sm text-gray-500">Lease Duration</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.maxBudget}</h4>
                  <p className="text-sm text-gray-500">Maximum rent budget</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.moveInDate}</h4>
                  <p className="text-sm text-gray-500">Move in date</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Brief Information about yourself</h4>
                <p className="text-sm text-gray-600">
                  {formData.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Lifestyle Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Lifestyle Information
                <span className="ml-2 text-green-500">
                  <Check size={16} />
                </span>
              </h3>
              <button 
                className="text-purple-600 hover:text-purple-800"
                onClick={() => setLifestyleModal(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.cleanliness}</h4>
                  <p className="text-sm text-gray-500">How would you describe your cleanliness?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.workHours}</h4>
                  <p className="text-sm text-gray-500">How would you describe your school/work hours?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.sleepHours}</h4>
                  <p className="text-sm text-gray-500">How would you describe your sleeping hours?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.tobacco}</h4>
                  <p className="text-sm text-gray-500">How would you describe your relationship with tobacco?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.alcohol}</h4>
                  <p className="text-sm text-gray-500">How would you describe your relationship with alcohol</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.drugs}</h4>
                  <p className="text-sm text-gray-500">How would you describe your relationship with drugs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium">{formData.cooking}</h4>
                  <p className="text-sm text-gray-500">How often do you cook?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Neighborhood Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Neighborhood Information
                <span className="ml-2 text-green-500">
                  <Check size={16} />
                </span>
              </h3>
              <button 
                className="text-purple-600 hover:text-purple-800"
                onClick={() => setNeighborhoodModal(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{formData.city}</h4>
                <p className="text-sm text-gray-500">City</p>
              </div>

              <div className="space-y-2">
                {formData.neighborhoods.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-purple-600 mr-2">
                      <Check size={14} className="text-white" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Room Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Room Information
                <span className="ml-2 text-green-500">
                  <Check size={16} />
                </span>
              </h3>
              <button 
                className="text-purple-600 hover:text-purple-800"
                onClick={() => setRoomInfoModal(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.houseLocation}</h4>
                  <p className="text-sm text-gray-500">Where is the house located?</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.apartmentType}</h4>
                  <p className="text-sm text-gray-500">Apartment Type</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.areaName}</h4>
                  <p className="text-sm text-gray-500">What is the name of the area/neighborhood</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.furniture}</h4>
                  <p className="text-sm text-gray-500">Furniture</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{formData.bedrooms}</h4>
                  <p className="text-sm text-gray-500">Total Number of Bedrooms</p>
                </div>
                <div>
                  <h4 className="font-medium">{formData.bathrooms}</h4>
                  <p className="text-sm text-gray-500">Total Number of Bathrooms</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Amenities Available in the House</h4>
                <div className="grid grid-cols-2 gap-2">
                  {formData.amenities.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-purple-600 mr-2">
                        <Check size={14} className="text-white" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Brief Information about the room</h4>
                <p className="text-sm text-gray-600">
                  {formData.roomInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {/* Personal Information Modal */}
      <Dialog open={personalInfoModal} onOpenChange={setPersonalInfoModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input 
                name="age" 
                type="number" 
                value={formData.age} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Home Town</Label>
              <Input 
                name="hometown" 
                value={formData.hometown} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship Status</Label>
              <Select 
                value={formData.relationshipStatus} 
                onValueChange={(value:any) => handleSelectChange("relationshipStatus", value)}
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
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input 
                name="occupation" 
                value={formData.occupation} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Offering room for rent?</Label>
              <Select 
                value={formData.offeringRoom} 
                onValueChange={(value:any) => handleSelectChange("offeringRoom", value)}
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
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Rent Budget</Label>
              <Input 
                name="maxBudget" 
                value={formData.maxBudget} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Move In Date</Label>
              <Input 
                name="moveInDate" 
                value={formData.moveInDate} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>About Yourself</Label>
              <Textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleInputChange} 
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPersonalInfoModal(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lifestyle Information Modal */}
      <Dialog open={lifestyleModal} onOpenChange={setLifestyleModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Lifestyle Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cleanliness</Label>
              <Select 
                value={formData.cleanliness} 
                onValueChange={(value:any) => handleSelectChange("cleanliness", value)}
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
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Sleeping Hours</Label>
              <Input 
                name="sleepHours" 
                value={formData.sleepHours} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Tobacco Use</Label>
              <Select 
                value={formData.tobacco} 
                onValueChange={(value:any) => handleSelectChange("tobacco", value)}
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
                onValueChange={(value:any) => handleSelectChange("alcohol", value)}
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
                onValueChange={(value:any) => handleSelectChange("drugs", value)}
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
                onValueChange={(value:any) => handleSelectChange("cooking", value)}
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setLifestyleModal(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Neighborhood Information Modal */}
      <Dialog open={neighborhoodModal} onOpenChange={setNeighborhoodModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Neighborhood Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Neighborhoods</Label>
              <div className="space-y-2">
                {formData.neighborhoods.map((neighborhood, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={neighborhood} 
                      onChange={(e) => {
                        const newNeighborhoods = [...formData.neighborhoods]
                        newNeighborhoods[index] = e.target.value
                        handleArrayChange("neighborhoods", newNeighborhoods)
                      }}
                    />
                    <button 
                      className="text-red-500"
                      onClick={() => {
                        const newNeighborhoods = formData.neighborhoods.filter((_, i) => i !== index)
                        handleArrayChange("neighborhoods", newNeighborhoods)
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => handleArrayChange("neighborhoods", [...formData.neighborhoods, ""])}
                >
                  Add Neighborhood
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNeighborhoodModal(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Information Modal */}
      <Dialog open={roomInfoModal} onOpenChange={setRoomInfoModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room Information</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>House Location</Label>
              <Input 
                name="houseLocation" 
                value={formData.houseLocation} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Apartment Type</Label>
              <Select 
                value={formData.apartmentType} 
                onValueChange={(value:any) => handleSelectChange("apartmentType", value)}
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
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Furniture</Label>
              <Select 
                value={formData.furniture} 
                onValueChange={(value:any) => handleSelectChange("furniture", value)}
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
                onChange={handleInputChange} 
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Bathrooms</Label>
              <Input 
                name="bathrooms" 
                type="number" 
                value={formData.bathrooms} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Running Water",
                  "Electricity",
                  "Solar Inverter",
                  "WiFi",
                  "Parking",
                  "Security",
                  "Gym",
                  "Pool"
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Switch 
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked:any) => {
                        const newAmenities = checked
                          ? [...formData.amenities, amenity]
                          : formData.amenities.filter(a => a !== amenity)
                        handleArrayChange("amenities", newAmenities)
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
                onChange={handleInputChange} 
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoomInfoModal(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}