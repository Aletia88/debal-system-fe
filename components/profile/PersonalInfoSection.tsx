"use client"
import { Check, Pencil } from "lucide-react"

export default function PersonalInfoSection({ 
  data, 
  onEdit 
}: { 
  data: any, 
  onEdit: () => void 
}) {
  return (
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
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">{data.fullName}</h4>
            <p className="text-sm text-gray-500">Full Name</p>
          </div>
          <div>
            <h4 className="font-medium">{data.age}</h4>
            <p className="text-sm text-gray-500">Age</p>
          </div>
        </div>

        {/* Rest of the personal info fields */}
        {/* ... */}
      </div>
    </div>
  )
}