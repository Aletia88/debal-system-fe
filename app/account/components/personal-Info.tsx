"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    location: "Minna-Niger State",
    offeringRoom: "Yes",
    phoneNumber: "",
    age: "",
    gender: "Minna-Niger State",
    moveInDate: "Yes",
    petPerson: "Minna-Niger State",
    relationshipStatus: "Yes",
    maxRentBudget: "Minna-Niger State",
    leaseDuration: "Yes",
    occupation: "Minna-Niger State",
    hometown: "Yes",
    briefInfo:
      "Nunc nulla tincidunt quis tincidunt tellus, tellus. Iaculis eu, convallis porttitor accumsan. Risus arcu, volutpat amet sit morbi. Integer orci, ut faucibus eros, dignissim neque, consectetur. Sit sit purus vivamus dapibus. Aliquam morbi viverra nisi, nunc, nunc bibendum metus, platea.",
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Purple header bar */}
          <div className="h-2 bg-purple-600"></div>

          <div className="p-8">
            <h1 className="text-2xl font-bold text-purple-900 mb-2">Personal Information</h1>
            <p className="text-gray-600 mb-8">
              Here you can tailor your search to the exact neigboorhoods you want to live in
            </p>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Where are you looking for roommate */}
                <div>
                  <label className="block text-gray-600 mb-2">Where are you looking for roommate</label>
                  <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minna-Niger State">Minna-Niger State</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Are you offering a room for rent */}
                <div>
                  <label className="block text-gray-600 mb-2">Are you offering a room for rent</label>
                  <Select value={formData.offeringRoom} onValueChange={(value) => handleChange("offeringRoom", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-600 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    className="bg-gray-50 border-gray-200"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-gray-600 mb-2">Age</label>
                  <Input
                    type="number"
                    className="bg-gray-50 border-gray-200"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-600 mb-2">Gender</label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Minna-Niger State">Minna-Niger State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Move in Date */}
                <div>
                  <label className="block text-gray-600 mb-2">Move in Date</label>
                  <Select value={formData.moveInDate} onValueChange={(value) => handleChange("moveInDate", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="Immediately">Immediately</SelectItem>
                      <SelectItem value="Next Month">Next Month</SelectItem>
                      <SelectItem value="In 3 Months">In 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Are you a pet person? */}
                <div>
                  <label className="block text-gray-600 mb-2">Are you a pet person?</label>
                  <Select value={formData.petPerson} onValueChange={(value) => handleChange("petPerson", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Minna-Niger State">Minna-Niger State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Relationship Status */}
                <div>
                  <label className="block text-gray-600 mb-2">Relationship Status</label>
                  <Select
                    value={formData.relationshipStatus}
                    onValueChange={(value) => handleChange("relationshipStatus", value)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="In a Relationship">In a Relationship</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Rent Budget */}
                <div>
                  <label className="block text-gray-600 mb-2">Max Rent Budget</label>
                  <Select
                    value={formData.maxRentBudget}
                    onValueChange={(value) => handleChange("maxRentBudget", value)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN50,000">NGN50,000</SelectItem>
                      <SelectItem value="NGN100,000">NGN100,000</SelectItem>
                      <SelectItem value="NGN150,000">NGN150,000</SelectItem>
                      <SelectItem value="Minna-Niger State">Minna-Niger State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lease Duration */}
                <div>
                  <label className="block text-gray-600 mb-2">Lease Duration</label>
                  <Select
                    value={formData.leaseDuration}
                    onValueChange={(value) => handleChange("leaseDuration", value)}
                  >
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 Months">3 Months</SelectItem>
                      <SelectItem value="6 Months">6 Months</SelectItem>
                      <SelectItem value="1 Year">1 Year</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="block text-gray-600 mb-2">Occupation</label>
                  <Select value={formData.occupation} onValueChange={(value) => handleChange("occupation", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                      <SelectItem value="Minna-Niger State">Minna-Niger State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Home town */}
                <div>
                  <label className="block text-gray-600 mb-2">Home town</label>
                  <Select value={formData.hometown} onValueChange={(value) => handleChange("hometown", value)}>
                    <SelectTrigger className="bg-gray-50 border-gray-200">
                      <SelectValue placeholder="Select hometown" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Abuja">Abuja</SelectItem>
                      <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brief Information About yourself */}
              <div className="mt-6">
                <label className="block text-gray-600 mb-2">Brief Information About yourself</label>
                <Textarea
                  className="bg-gray-50 border-gray-200 min-h-[120px]"
                  value={formData.briefInfo}
                  onChange={(e) => handleChange("briefInfo", e.target.value)}
                />
              </div>

              {/* Save and Continue Button */}
              <div className="mt-8 flex justify-center">
                {/* <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-md w-full max-w-md text-lg"
                >
                  Save and Continue
                </Button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
