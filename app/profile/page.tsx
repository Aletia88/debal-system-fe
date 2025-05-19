"use client"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram, Check, Pencil, X, ChevronLeft, ChevronRight, Upload, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import PersonalInfo from "./components/personal-info"
import LifestyleInfo from "./components/LifestyleInfo"
import { FileInput, SimpleGrid, Stack } from "@mantine/core"
import NeighborhoodInfo from "./components/NeighborhoodInfo"
import WorkInfo from "./components/WorkInfo"
import FoodInfo from "./components/FoodInfo"
import HobbiesInfo from "./components/Hobbies"
import FinancialInfo from "./components/FinancialInfo"
import PetsInfo from "./components/Pets"
import SharedLivingInfo from "./components/SharedLivingInfo"
import { useGetProfileQuery, useUpdateProfilePhotoMutation } from "@/store/profile"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export default function ProfilePage() {
  const { data: profile } = useGetProfileQuery({})
  const [uploadPhotos] = useUpdateProfilePhotoMutation()
  const [updateProfilePhoto] = useUpdateProfilePhotoMutation()
  const { toast } = useToast()
  
  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  console.log(`${baseUrl}${profile?.photos[0].url}/`)
 

  const handleImageUpload = async () => {
    if (files.length === 0) return

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('photos', file) // This creates the correct multipart format
      })

      // Create headers without Content-Type to let browser set it automatically
      const headers = new Headers()
      headers.append('Authorization', `Bearer ${localStorage.getItem("token")}`)

      await fetch('https://debal-api.onrender.com/api/profiles/photo', {
        method: 'POST',
        body: formData,
        headers
      })

      toast({
        title: "Success",
        description: "Photos uploaded successfully",
      })
      setFiles([])
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload photos",
        variant: "destructive",
      })
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Profile Header */}
      <div className="bg-white py-6 px-4 text-center">
        <h1 className="text-2xl font-bold text-purple-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Holla!, Fill in the details to complete sign up</p>
      </div>

      {/* Profile Banner */}
      <div className="bg-purple-900 py-12 mt-5 px-4 text-center text-white relative">
        <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
          <Avatar className="h-24 w-24 border-4 border-white bg-cover">
            <AvatarImage src={profile?.photo_url || "/image.png"} alt="Profile" />
            <AvatarFallback>
              {profile?.user.name?.split(' ').map(n => n[0]).join('') || 'RU'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">{profile?.user.name}</h2>
          <p className="text-purple-200 text-sm">{profile?.user.email}</p>

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

      {/* Photo Upload Section */}
      <div className="container mx-auto px-4 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
            <div className="flex gap-2">
              <FileInput
                value={files}
                onChange={setFiles}
                accept="image/*"
                multiple
                placeholder="Select photos"
                className="w-64"
              />
              <Button 
                onClick={handleImageUpload}
                disabled={files.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Upload size={16} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {profile?.photos?.length > 0 ? (
            <div className="flex flex-wrap gap-4 mt-4">
              {profile.photos.map((photo, index) => (
                <div key={photo.id || index} className="relative group">
                  <Image
                    src={`${baseUrl}${photo.url}`}
                    alt={`${baseUrl}`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-md object-cover cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
                    onClick={() => {
                      setSelectedImageIndex(index)
                      setIsViewerOpen(true)
                    }}
                  />
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetProfilePhoto(photo.url)
                      }}
                      title="Set as profile photo"
                    >
                      <Check size={16} className="text-purple-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No photos uploaded yet</p>
            </div>
          )}
        </div>


        {/* Image Viewer Modal */}
        {isViewerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image
                src={`${baseUrl}${profile.photos[selectedImageIndex].url}`}
                alt={`Photo ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="absolute top-4 right-4">
                <Button 
                  variant="default" 
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  onClick={() => handleSetProfilePhoto(profile.photos[selectedImageIndex].url)}
                >
                  <Check size={16} className="mr-2" />
                  Set as Profile Photo
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100"
                onClick={() => setSelectedImageIndex(prev => 
                  prev === 0 ? profile.photos.length - 1 : prev - 1
                )}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100"
                onClick={() => setSelectedImageIndex(prev => 
                  prev === profile.photos.length - 1 ? 0 : prev + 1
                )}
              >
                <ChevronRight size={24} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 left-4 bg-white hover:bg-gray-100"
                onClick={() => setIsViewerOpen(false)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        )}
        {/* Profile Content Sections */}
        <SimpleGrid cols={2}>
          <Stack><PersonalInfo /><NeighborhoodInfo /> <WorkInfo /> <HobbiesInfo /> <PetsInfo /></Stack>
          <Stack><LifestyleInfo /> <FoodInfo /> <FinancialInfo /> <SharedLivingInfo /></Stack>
        </SimpleGrid>
      </div>
    </div>
  )
}