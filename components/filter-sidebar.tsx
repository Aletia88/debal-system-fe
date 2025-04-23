"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface FilterSidebarProps {
  onClose: () => void
}

export default function FilterSidebar({ onClose }: FilterSidebarProps) {
  const [gender, setGender] = useState<"male" | "female" | "any">("male")
  const [budget, setBudget] = useState([100000, 150000])
  const [needType, setNeedType] = useState<"room" | "roommate">("room")
  const [leaseDurations, setLeaseDurations] = useState([true, true, true, true])

  const handleLeaseDurationChange = (index: number) => {
    const newLeaseDurations = [...leaseDurations]
    newLeaseDurations[index] = !newLeaseDurations[index]
    setLeaseDurations(newLeaseDurations)
  }

  const handleReset = () => {
    setGender("male")
    setBudget([100000, 150000])
    setNeedType("room")
    setLeaseDurations([true, true, true, true])
  }

  const handleApply = () => {
    // Apply filters logic here
    onClose()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Gender Selection */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">Select Gender</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setGender("male")}
            className={`px-6 py-2 rounded-md transition-colors ${
              gender === "male"
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Male
          </button>
          <button
            onClick={() => setGender("female")}
            className={`px-6 py-2 rounded-md transition-colors ${
              gender === "female"
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Female
          </button>
          <button
            onClick={() => setGender("any")}
            className={`px-6 py-2 rounded-md transition-colors ${
              gender === "any"
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Any
          </button>
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h3 className="text-gray-500">Budget</h3>
          <span className="text-purple-600 font-medium">
            NGN{budget[0].toLocaleString()} - {budget[1].toLocaleString()}
          </span>
        </div>
        <Slider
          defaultValue={budget}
          min={50000}
          max={500000}
          step={10000}
          value={budget}
          onValueChange={setBudget}
          className="mt-6"
        />
      </div>

      {/* Need Type */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">I Need a</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setNeedType("room")}
            className={`px-6 py-2 rounded-md transition-colors ${
              needType === "room"
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Room
          </button>
          <button
            onClick={() => setNeedType("roommate")}
            className={`px-6 py-2 rounded-md transition-colors ${
              needType === "roommate"
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Roommate
          </button>
        </div>
      </div>

      {/* Lease Duration */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">Lease Duration</h3>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  leaseDurations[index] ? "bg-purple-600" : "border border-gray-300"
                }`}
                onClick={() => handleLeaseDurationChange(index)}
              >
                {leaseDurations[index] && <Check size={14} className="text-white" />}
              </div>
              <span className="text-gray-700">6 Months</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-50"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
        <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
