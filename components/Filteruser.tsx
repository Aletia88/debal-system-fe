'use client';

import Image from "next/image";
import { Contact2, Eye, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Photo {
  url: string;
  isProfile: boolean;
  filename?: string;
  // Add other photo properties if needed
}

interface PersonalInfo {
  age: number;
  gender: string;
  occupation?: string;
  religion?: string;
  relationship_status?: string;
}

interface Lifestyle {
  personality_type?: string;
  daily_routine?: string;
  sleep_pattern?: string;
}

interface SharedLiving {
  cleanliness_level?: string;
  chore_sharing_preference?: string;
  noise_tolerance?: string;
  guest_frequency?: string;
  party_habits?: string;
}

interface RecommendationUser {
  user_id: string;
  name: string;
  email?: string;
  photos?: Photo[];
  personalInfo?: PersonalInfo;
  lifestyle?: Lifestyle;
  hobbies?: string[];
  sharedLiving?: SharedLiving;
}

interface Recommendation {
  user_id: string;
  compatibility_score?: number;
  cluster_id?: number;
  age?: number;
  gender?: string;
  personality_type?: string;
  hobbies?: string[];
  user: RecommendationUser;
  name?: string;
  occupation?: string;
  religion?: string;
}

interface MatchCardProps {
  recommendation: Recommendation;
  onMessageClick?: (userId: string) => void;
  onLikeToggle?: (userId: string, liked: boolean) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export const FilterUser = ({ recommendation, onMessageClick, onLikeToggle }: MatchCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  const handleStartChat = (id: string) => {
    router.push(`/chat?newChat=${id}`);
  };

  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onLikeToggle) {
      onLikeToggle(recommendation.user_id, newLikedState);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') === null) {
      openModal();
    }
  };

  const profilePhoto = recommendation.user?.photos?.find(photo => photo.isProfile);
  const name = recommendation.user?.name || recommendation.name;
  const age = recommendation.user?.personalInfo?.age || recommendation.age;
  const gender = recommendation.user?.personalInfo?.gender || recommendation.gender;
  const occupation = recommendation.user?.personalInfo?.occupation || recommendation.occupation;
  const religion = recommendation.user?.personalInfo?.religion || recommendation.religion;
  const hobbies = recommendation.user?.hobbies || recommendation.hobbies || [];

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative h-48">
          <Image 
            src={profilePhoto ? `${baseUrl}${profilePhoto.url}` : "/image"}
            alt={profilePhoto?.filename || "Profile image"} 
            fill 
            className="object-cover" 
          />
          <button 
            className="absolute top-2 left-2 p-2 bg-white/80 rounded-full hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            <Eye size={18} />
          </button>
          <button 
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <Heart 
              size={18} 
              fill={isLiked ? "red" : "none"} 
              color={isLiked ? "red" : "currentColor"} 
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{name}</h3>
          <div className="flex justify-end items-center mt-2">
            <div className="flex space-x-2">
              <button 
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartChat(recommendation.user_id);
                }}
              >
                <MessageCircle size={18} />
              </button>
              <button  
                className="p-2 bg-white border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${recommendation.user_id}`);
                }}
              >
                <Contact2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={profilePhoto ? `${baseUrl}${profilePhoto.url}` : "/image"}
                alt={name || "Profile image"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-500">Age</h4>
                <p className="font-medium">{age}</p>
              </div>
              
              {occupation && (
                <div>
                  <h4 className="text-sm text-gray-500">Occupation</h4>
                  <p className="font-medium">{occupation}</p>
                </div>
              )}
              
              {gender && (
                <div>
                  <h4 className="text-sm text-gray-500">Gender</h4>
                  <p className="font-medium">{gender}</p>
                </div>
              )}
              
              {religion && (
                <div>
                  <h4 className="text-sm text-gray-500">Religion</h4>
                  <p className="font-medium">{religion}</p>
                </div>
              )}
              
              {hobbies.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-500">Hobbies</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hobbies.map((hobby, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  onClick={() => {
                    closeModal();
                    handleStartChat(recommendation.user_id);
                  }}
                >
                  <MessageCircle size={18} />
                  Message
                </button>
                <button 
                  onClick={() => router.push(`/profile/${recommendation.user_id}`)} 
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  <Contact2 size={18} />
                  Profile
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};