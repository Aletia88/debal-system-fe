"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useGetFilteredUsersQuery } from "@/store/profile"

interface FilterSidebarProps {
  onClose: () => void
  onFiltersApplied: (filters: any) => void
}

export default function FilterSidebar({ onClose, onFiltersApplied }: FilterSidebarProps) {
  const [gender, setGender] = useState<string>("")
  const [ageRange, setAgeRange] = useState([18, 60])
  const [occupation, setOccupation] = useState("")
  const [religion, setReligion] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [hasPets, setHasPets] = useState<boolean | null>(null)

  const handleReset = () => {
    setGender("")
    setAgeRange([18, 60])
    setOccupation("")
    setReligion("")
    setCity("")
    setCountry("")
    setIsOnline(null)
    setHasPets(null)
  }

  const handleApply = () => {
    const filters = {
      ...(gender && { gender }),
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      ...(occupation && { occupation }),
      ...(religion && { religion }),
      ...(city && { city }),
      ...(country && { country }),
      ...(isOnline !== null && { isOnline: isOnline.toString() }),
      ...(hasPets !== null && { hasPets: hasPets.toString() }),
    }

    onFiltersApplied(filters)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto md:relative md:max-w-xs">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Gender Selection */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">Gender</h3>
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
            onClick={() => setGender("")}
            className={`px-6 py-2 rounded-md transition-colors ${
              gender === ""
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Any
          </button>
        </div>
      </div>

      {/* Age Range */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h3 className="text-gray-500">Age Range</h3>
          <span className="text-purple-600 font-medium">
            {ageRange[0]} - {ageRange[1]} years
          </span>
        </div>
        <Slider
          defaultValue={ageRange}
          min={18}
          max={100}
          step={1}
          value={ageRange}
          onValueChange={setAgeRange}
          className="mt-6"
        />
      </div>

      {/* Occupation */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-2">Occupation</h3>
        <input
          type="text"
          placeholder="e.g. developer, teacher"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Religion */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-2">Religion</h3>
        <input
          type="text"
          placeholder="e.g. christian, muslim"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Location */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-2">City</h3>
        <input
          type="text"
          placeholder="e.g. Addis Ababa"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 mb-4"
        />
        <h3 className="text-gray-500 mb-2">Country</h3>
        <input
          type="text"
          placeholder="e.g. Ethiopia"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Online Status */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">Online Status</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsOnline(true)}
            className={`px-6 py-2 rounded-md transition-colors ${
              isOnline === true
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setIsOnline(false)}
            className={`px-6 py-2 rounded-md transition-colors ${
              isOnline === false
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Offline
          </button>
          <button
            onClick={() => setIsOnline(null)}
            className={`px-6 py-2 rounded-md transition-colors ${
              isOnline === null
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Any
          </button>
        </div>
      </div>

      {/* Pets */}
      <div className="mb-8">
        <h3 className="text-gray-500 mb-4">Has Pets</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setHasPets(true)}
            className={`px-6 py-2 rounded-md transition-colors ${
              hasPets === true
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setHasPets(false)}
            className={`px-6 py-2 rounded-md transition-colors ${
              hasPets === false
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            No
          </button>
          <button
            onClick={() => setHasPets(null)}
            className={`px-6 py-2 rounded-md transition-colors ${
              hasPets === null
                ? "border-2 border-purple-500 text-purple-600"
                : "border border-gray-200 text-gray-500 hover:border-purple-200"
            }`}
          >
            Any
          </button>
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