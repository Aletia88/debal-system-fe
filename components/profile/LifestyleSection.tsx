"use client"
import { Check, Pencil } from "lucide-react"

export default function LifestyleSection({ 
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
          Lifestyle Information
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
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.cleanliness}</h4>
            <p className="text-sm text-gray-500">How would you describe your cleanliness?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.workHours}</h4>
            <p className="text-sm text-gray-500">How would you describe your school/work hours?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.sleepHours}</h4>
            <p className="text-sm text-gray-500">How would you describe your sleeping hours?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.tobacco}</h4>
            <p className="text-sm text-gray-500">How would you describe your relationship with tobacco?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.alcohol}</h4>
            <p className="text-sm text-gray-500">How would you describe your relationship with alcohol</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.drugs}</h4>
            <p className="text-sm text-gray-500">How would you describe your relationship with drugs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-medium">{data.cooking}</h4>
            <p className="text-sm text-gray-500">How often do you cook?</p>
          </div>
        </div>
      </div>
    </div>
  )
}