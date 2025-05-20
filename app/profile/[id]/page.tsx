'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetProfileByIdQuery } from "@/store/profile"
import { Button, SimpleGrid, Stack } from "@mantine/core"
import { Twitter, Facebook, Instagram, Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"
import FinancialInfo from "../components/FinancialInfo"
import FoodInfo from "../components/FoodInfo"
import HobbiesInfo from "../components/Hobbies"
import LifestyleInfo from "../components/LifestyleInfo"
import NeighborhoodInfo from "../components/NeighborhoodInfo"
import PersonalInfo from "../components/personal-info"
import PetsInfo from "../components/Pets"
import SharedLivingInfo from "../components/SharedLivingInfo"
import WorkInfo from "../components/WorkInfo"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
const ProfileDetail = () => {
    const {id} = useParams()
    const {data:profile} = useGetProfileByIdQuery(id)
  const profilePhoto = profile?.photos?.find((photo:any) => photo.isProfile);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const [isViewerOpen, setIsViewerOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
        {/* Profile Header */}
        <div className="bg-white py-6 px-4 text-center">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Profile Info</h1>
          {/* <p className="text-gray-500 mt-1">Holla!, Fill in the details to complete sign up</p> */}
        </div>
  
        {/* Profile Banner */}
        <div className="bg-purple-900 py-12 mt-5 px-4 text-center text-white relative">
          <div className="absolute left-1/2 -top-12 transform -translate-x-1/2">
            <Avatar className="h-24 w-24 border-4 border-white bg-cover">
              <AvatarImage
                src={profilePhoto ? `${baseUrl}${profilePhoto.url}` : "/image.png"}
                alt="Profile"
              />
              <AvatarFallback>
                {profile?.user.name?.split(' ').map((n:any) => n[0]).join('') || 'RU'}
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

        <div className="container mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        {/* <div className="flex  items-center mb-4"> */}
            <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
                   
              <div className="flex flex-wrap gap-2 mt-4">
                {profile?.photos.map((photo:any, index:any) => (
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
                    </div>
                ))}
                {/* </div> */}
                </div>
                </div>
          
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
        <SimpleGrid cols={2}>
          <Stack><PersonalInfo /><NeighborhoodInfo /> <WorkInfo /> <HobbiesInfo /> <PetsInfo /></Stack>
          <Stack><LifestyleInfo /> <FoodInfo /> <FinancialInfo /> <SharedLivingInfo /></Stack>
        </SimpleGrid>
        </div>
        </div>

    )
}

export default ProfileDetail;