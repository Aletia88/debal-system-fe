'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetProfileByIdQuery, useGetProfileQuery } from "@/store/profile"
import { Badge, Button, Modal, Rating, SimpleGrid, Stack, Textarea, TextInput } from "@mantine/core"
import { Twitter, Facebook, Instagram, Check, ChevronLeft, ChevronRight, X, MessageCircle, Flag } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import FinancialInfo from "../components/FinancialInfo"
import FoodInfo from "../components/FoodInfo"
import HobbiesInfo from "../components/Hobbies"
import LifestyleInfo from "../components/LifestyleInfo"
import NeighborhoodInfo from "../components/NeighborhoodInfo"
import PersonalInfo from "../components/personal-info"
import PetsInfo from "../components/Pets"
import SharedLivingInfo from "../components/SharedLivingInfo"
import WorkInfo from "../components/WorkInfo"
import ProfileInfo from "../components/ProviderInfo"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
const ProfileDetail = () => {
  const { id } = useParams()
  const { data: profile } = useGetProfileByIdQuery(id)
  const { data: userProfile } = useGetProfileQuery({})
  const profilePhoto = profile?.photos?.find((photo: any) => photo.isProfile);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // Initialize with 0 or another valid index
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [userRole, setUserRole] = useState<'user' | 'houseprovider' | null>(null);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Feedback form
  const feedbackForm = useForm({
    initialValues: {
      userId: id as string,
      message: '',
      // rating: 3,
    },
    validate: {
      message: (value) => (value.length < 10 ? 'Message must be at least 10 characters' : null),
      // rating: (value) => (value < 1 || value > 5 ? 'Rating must be between 1 and 5' : null),
    },
  });

  // Report form
  const reportForm = useForm({
    initialValues: {
      reporterId: userProfile?.user._id,
      reportedUserId: id as string,
      reason: '',
      details: '',
    },
    validate: {
      reason: (value) => (value.length < 5 ? 'Reason must be at least 5 characters' : null),
      details: (value) => (value.length < 10 ? 'Details must be at least 10 characters' : null),
    },
  });

  console.log(profile)
  useEffect(() => {
    // Check if we have profile data and determine the role
    if (profile?.user.role) {
      setUserRole(profile.user.role);
    }
  }, [profile]);

  console.log('role', profile)

  const handleSubmitFeedback = async (values: any) => {
    try {
      const response = await fetch(`${baseUrl}api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        showNotification({
          title: 'Success',
          message: 'Feedback submitted successfully',
          color: 'green',
          icon: <Check size={16} />,
        });
        setFeedbackModalOpen(false);
        feedbackForm.reset();
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to submit feedback',
        color: 'red',
        icon: <X size={16} />,
      });
    }
  };

  const handleSubmitReport = async (values: any) => {
    try {
      const response = await fetch(`${baseUrl}api/feedbacks/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        showNotification({
          title: 'Success',
          message: 'Report submitted successfully',
          color: 'green',
          icon: <Check size={16} />,
        });
        setReportModalOpen(false);
        reportForm.reset();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to submit report',
        color: 'red',
        icon: <X size={16} />,
      });
    }
  }

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
              {profile?.user.name?.split(' ').map((n: any) => n[0]).join('') || 'RU'}
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
      <div className="flex justify-center gap-4 mt-6">
        <Button
          leftSection={<MessageCircle size={16} />}
          onClick={() => setFeedbackModalOpen(true)}
          variant="light"
        >
          Leave Feedback
        </Button>
        <Button
          leftSection={<Flag size={16} />}
          onClick={() => setReportModalOpen(true)}
          variant="light"
          color="red"
        >
          Report User
        </Button>
      </div>


      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          {/* <div className="flex  items-center mb-4"> */}
          <h3 className="text-lg font-semibold text-gray-800">Photos</h3>

          <div className="flex flex-wrap gap-2 mt-4">
            {profile?.photos.map((photo: any, index: any) => (
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
                onClick={() => setSelectedImageIndex((prev: any) =>
                  prev === 0 ? profile.photos.length - 1 : prev - 1
                )}
              >
                <ChevronLeft size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100"
                onClick={() => setSelectedImageIndex((prev: any) =>
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
        {userRole == 'houseprovider' ?
          <SimpleGrid cols={{ base: 1, sm: 2, }}>
            <ProfileInfo />
          </SimpleGrid> :
          <SimpleGrid cols={{ base: 1, sm: 2, }}>
            <Stack><PersonalInfo /><NeighborhoodInfo /> <WorkInfo /> <HobbiesInfo /> <PetsInfo /></Stack>
            <Stack><LifestyleInfo /> <FoodInfo /> <FinancialInfo /> <SharedLivingInfo /></Stack>
          </SimpleGrid>}
        <Modal
          opened={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          title="Leave Feedback"
        >
          <form onSubmit={feedbackForm.onSubmit(handleSubmitFeedback)}>
            <input type="hidden" {...feedbackForm.getInputProps('userId')} />

            <Textarea
              label="Your Feedback"
              placeholder="Share your experience with this user..."
              {...feedbackForm.getInputProps('message')}
              required
              minRows={4}
              className="mb-4"
            />

            {/* <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Rating
                {...feedbackForm.getInputProps('rating')}
                count={5}
                className="mt-1"
              />
            </div> */}

            <Button type="submit" fullWidth>
              Submit Feedback
            </Button>
          </form>
        </Modal>

        {/* Report Modal */}
        <Modal
          opened={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Report User"
        >
          <form onSubmit={reportForm.onSubmit(handleSubmitReport)}>
            <input type="hidden" {...reportForm.getInputProps('reportedUserId')} />

            <TextInput
              label="Reason for Report"
              placeholder="Briefly describe the reason..."
              {...reportForm.getInputProps('reason')}
              required
              className="mb-4"
            />

            <Textarea
              label="Detailed Explanation"
              placeholder="Provide as much detail as possible..."
              {...reportForm.getInputProps('details')}
              required
              minRows={4}
              className="mb-4"
            />

            <Button type="submit" color="red" fullWidth>
              Submit Report
            </Button>
          </form>
        </Modal>
      </div>
    </div>

  )
}

export default ProfileDetail;