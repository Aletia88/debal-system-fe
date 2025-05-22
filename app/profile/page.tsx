"use client"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram, Check, Pencil, X, ChevronLeft, ChevronRight, Upload, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import PersonalInfo from "./components/personal-info"
import LifestyleInfo from "./components/LifestyleInfo"
import { Badge, FileInput, Modal, ModalContent, SimpleGrid, Stack } from "@mantine/core"
import NeighborhoodInfo from "./components/NeighborhoodInfo"
import WorkInfo from "./components/WorkInfo"
import FoodInfo from "./components/FoodInfo"
import HobbiesInfo from "./components/Hobbies"
import FinancialInfo from "./components/FinancialInfo"
import PetsInfo from "./components/Pets"
import SharedLivingInfo from "./components/SharedLivingInfo"
import { useGetProfileQuery, useGetProviderProfileByIdQuery, useGetProviderProfileQuery, useRemoveProfilePhotoMutation, useSetProfilePhotoMutation, useUpdateProfilePhotoMutation } from "@/store/profile"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useDisclosure } from "@mantine/hooks"
import ProfileInfo from "./components/ProviderInfo"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export default function ProfilePage() {
  const { data: profile } = useGetProfileQuery({})
  const [uploadPhotos] = useSetProfilePhotoMutation()
  // const [deletePhoto] = useRemoveProfilePhotoMutation()
  const [updateProfilePhoto] = useUpdateProfilePhotoMutation()
  const { toast } = useToast()
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  // const {data: provider} = useGetProviderProfileByIdQuery(profile.user._id)
  const {data: providers} = useGetProviderProfileQuery({})
  const [userRole, setUserRole] = useState<'user' | 'houseprovider' | null>(null);

  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // Initialize with 0 or another valid index
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [opened, { open, close }] = useDisclosure(false);

  const profilePhoto = profile?.photos?.find((photo:any) => photo.isProfile);
  // console.log(`${baseUrl}${profilePhoto?.url}`)

  const [removeProfilePhoto] = useRemoveProfilePhotoMutation();

  useEffect(() => {
    // Check if we have profile data and determine the role
    if (profile?.user.role) {
      setUserRole(profile.user.role);
    }
  }, [profile]);

  const handleDeleteClick = (filename: string) => {
    setPhotoToDelete(filename);
    open();
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    try {
      await removeProfilePhoto(photoToDelete).unwrap();
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error:any) {
      toast({
        title: "Failed to delete photo",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      close();
      setPhotoToDelete(null);
    }
  };
  const handleSetProfilePhoto = async (filename: string) => {
    try {
      await uploadPhotos(filename).unwrap(); // Now passing just the filename
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
      setIsViewerOpen(false);
    } catch (error:any) {
      toast({
        title: "Failed to update profile photo",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };
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
    } catch (error:any) {
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

          <div className="mt-2 flex justify-center gap-2 flex-wrap">
                      {!profile?.user.isVerified && (
                        // <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                         
                        // </span>
                        <Badge color="yellow" variant="light"> Not Verified</Badge>
                      )}
                      {profile?.user.isblocked && (
                        
                         <Badge color="red" variant="light"> Blocked</Badge>
                      )}
                      {profile?.user.issuspended && (
                       
                        <Badge color="orange" variant="light"> Suspended</Badge>
                      )}
                      {profile?.user.isdeleted && (
                      
                        <Badge color="gray" variant="light"> Deleted</Badge>
                      )}
                      {profile?.user.isreported && (
                       
                        <Badge color="purple" variant="light"> Reported</Badge>
                      )}
                    </div>

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
          <div className="flex md:justify-between flex-col md:flex-row items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
            <div className="flex w-[95%] gap-2 px-2">
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
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.photos.map((photo:any, index:any) => (
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
                        e.stopPropagation();
                        handleSetProfilePhoto(photo.filename);
                      }}
                      title="Set as profile photo"
                    >
                      <Check size={16} className="text-purple-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(photo.filename);
                      }}
                      title="Delete photo"
                    >
                      <Trash2 size={16} className="text-red-600" />
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
                  onClick={() => handleSetProfilePhoto(profile.photos[selectedImageIndex].filename)}
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
        {userRole == 'houseprovider' ? 
         <SimpleGrid cols={{ base: 1, sm: 2,  }}>
        <ProfileInfo /> 
        </SimpleGrid>:
        <SimpleGrid cols={{ base: 1, sm: 2,  }}>
          <Stack><PersonalInfo /><NeighborhoodInfo /> <WorkInfo /> <HobbiesInfo /> <PetsInfo /></Stack>
          <Stack><LifestyleInfo /> <FoodInfo /> <FinancialInfo /> <SharedLivingInfo /></Stack>
        </SimpleGrid>}
        <Modal
          opened={opened}
          onClose={close}
          title="Delete Photo"
          centered
          overlayProps={{
            blur: 3,
          }}
        >
          <p>Are you sure you want to delete this photo?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
            // loading={removeProfilePhoto.isLoading}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}