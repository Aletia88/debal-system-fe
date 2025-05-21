'use client';

import Image from "next/image";
import { Contact2, Eye, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Photo {
  url: string;
  isProfile: boolean;
  // Add other photo properties if needed
}

interface RecommendationUser {
  _id: string;
  name: string;
  email: string;
  photos?: Photo[];
  personalInfo: {
    age: number;
    gender: string;
    occupation: string;
    religion: string;
    relationship_status: string;
  };
  lifestyle: {
    personality_type: string;
    daily_routine: string;
    sleep_pattern: string;
  };
  hobbies: string[];
  sharedLiving: {
    cleanliness_level: string;
    chore_sharing_preference: string;
    noise_tolerance: string;
    guest_frequency: string;
    party_habits: string;
  };
}

interface MatchCardProps {
  recommendation: {
    user_id: string;
    compatibility_score: number;
    cluster_id: number;
    age: number;
    gender: string;
    personality_type: string;
    hobbies: string[];
    user: RecommendationUser;
  };
  onMessageClick?: (userId: string) => void;
  onLikeToggle?: (userId: string, liked: boolean) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export const MatchCard = ({ recommendation, onMessageClick, onLikeToggle }: MatchCardProps) => {
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

  const matchPercentage = Math.round(recommendation.compatibility_score * 100);
  const user = recommendation.user;
  const profilePhoto = user?.photos?.find(photo => photo.isProfile);

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative h-48">
          <Image 
            src="/image.png" 
            alt={user.name} 
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
          <h3 className="font-bold text-lg">{user.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <div className="text-orange-400 font-bold">{matchPercentage}%</div>
              <div className="text-xs text-gray-400 ml-1">Match</div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartChat(user._id);
                }}
              >
                <MessageCircle size={18} />
              </button>
              <button  
                className="p-2 bg-white border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${user._id}`);
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
            <DialogTitle className="text-2xl">{user.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={profilePhoto ? `${baseUrl}${profilePhoto.url}` : "/image.png"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-orange-400 font-bold text-xl">
                  {matchPercentage}% Match
                </div>
                <button 
                  onClick={toggleLike}
                  className="p-2 bg-white border rounded-full hover:bg-gray-50"
                >
                  <Heart 
                    size={20} 
                    fill={isLiked ? "red" : "none"} 
                    color={isLiked ? "red" : "currentColor"} 
                  />
                </button>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500">Age</h4>
                <p className="font-medium">{user.personalInfo.age}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500">Occupation</h4>
                <p className="font-medium">{user.personalInfo.occupation}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500">Personality</h4>
                <p className="font-medium">{user.lifestyle.personality_type}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-gray-500">Daily Routine</h4>
                <p className="font-medium">{user.lifestyle.daily_routine}</p>
              </div>
              
              {recommendation.hobbies.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-500">Hobbies</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recommendation.hobbies.map((hobby, index) => (
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
                    handleStartChat(user._id);
                  }}
                >
                  <MessageCircle size={18} />
                  Message
                </button>
                <button 
                  onClick={() => router.push(`/profile/${user._id}`)} 
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