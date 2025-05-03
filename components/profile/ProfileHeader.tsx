"use client"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileHeader({ 
  fullName, 
  price,
  onEditProfile 
}: { 
  fullName: string
  price: string
  onEditProfile: () => void 
}) {
  return (
    <>
      {/* Profile Header */}
      <div className="bg-white py-6 px-4 text-center">
        <h1 className="text-2xl font-bold text-purple-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Holla!, Fill in the details to complete sign up</p>
        <Button 
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      </div>

      {/* Profile Banner */}
      <div className="bg-purple-900 py-12 px-4 text-center text-white relative">
        <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src="/image.png" alt="Profile" />
            <AvatarFallback>{fullName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">{fullName}</h2>
          <p className="text-purple-200 text-sm">{price}/year</p>

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
    </>
  )
}