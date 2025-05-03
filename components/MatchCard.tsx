'use client';

import Image from "next/image";
import { Eye, Heart, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MatchCardProps {
  user: {
    id: number;
    name: string;
    matchPercentage: number;
    image: string;
    // Add more user details for the modal
    age?: number;
    location?: string;
    bio?: string;
    interests?: string[];
  };
  onMessageClick: (userId: number) => void;
  onLikeToggle?: (userId: number, liked: boolean) => void;
}

export const MatchCard = ({ user, onMessageClick, onLikeToggle }: MatchCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onLikeToggle) {
      onLikeToggle(user.id, newLikedState);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle card click (but don't trigger for buttons inside the card)
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click was on the card itself, not a button inside it
    if ((e.target as HTMLElement).closest('button') === null) {
      openModal();
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <div className="relative h-48">
          <Image 
            src={user.image || "/image.png"} 
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
              <div className="text-orange-400 font-bold">{user.matchPercentage}%</div>
              <div className="text-xs text-gray-400 ml-1">Match</div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onMessageClick(user.id);
                }}
              >
                <MessageCircle size={18} />
              </button>
              <button 
                className="p-2 bg-white border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={18} />
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
                src={user.image || "/image.png"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="text-orange-400 font-bold text-xl">
                  {user.matchPercentage}% Match
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
              
              {user.age && (
                <div>
                  <h4 className="text-sm text-gray-500">Age</h4>
                  <p className="font-medium">{user.age}</p>
                </div>
              )}
              
              {user.location && (
                <div>
                  <h4 className="text-sm text-gray-500">Location</h4>
                  <p className="font-medium">{user.location}</p>
                </div>
              )}
              
              {user.bio && (
                <div>
                  <h4 className="text-sm text-gray-500">About</h4>
                  <p className="font-medium">{user.bio}</p>
                </div>
              )}
              
              {user.interests && user.interests.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-500">Interests</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-4 pt-4">
                <button 
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                  onClick={() => {
                    onMessageClick(user.id);
                    closeModal();
                  }}
                >
                  <MessageCircle size={18} />
                  Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
                  <Phone size={18} />
                  Call
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};