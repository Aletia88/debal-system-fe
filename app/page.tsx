'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Filter } from 'lucide-react';
import { MatchCard } from '@/components/MatchCard';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { Chat } from '@/types/chat';
import FilterSidebar from '@/components/filter-sidebar';
import { useGetProfileByRecommendationQuery } from '@/store/profile';

const chats: Chat[] = [
  { id: 1, name: "Rebecca Oyebanji", lastMessage: "You are you! When do you plan on moving...", unread: 3, online: true },
  { id: 2, name: "Alex Johnson", lastMessage: "Hey, how are you doing?", unread: 0, online: false },
  { id: 3, name: "Sarah Williams", lastMessage: "Let's meet tomorrow", unread: 1, online: true },
  { id: 4, name: "Michael Brown", lastMessage: "Thanks for the info!", unread: 0, online: false },
  { id: 5, name: "Emily Davis", lastMessage: "Did you see the news?", unread: 2, online: true },
  { id: 6, name: "David Miller", lastMessage: "Call me when you're free", unread: 0, online: false },
];

export default function MatchesPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  
  // Destructure the query result properly
  const { data: recommendations, isLoading, isError } = useGetProfileByRecommendationQuery({});

  const handleMessageClick = (userId: string) => { // Changed to string since _id is string
    // Find the numeric ID if needed, or adjust your chat system to use string IDs
    const numericId = parseInt(userId, 10) || 1; // Fallback to 1 if conversion fails
    setActiveChat(numericId);
    setChatOpen(true);
    setMinimized(false);
    setSidebarOpen(false);
  };

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilter = () => setShowFilter(!showFilter);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-purple-900">Loading matches...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Error loading matches. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Filter Sidebar */}
      {showFilter && (
        <aside className="bg-white shadow-md transition-all duration-300 ease-in-out">
          <FilterSidebar onClose={() => setShowFilter(false)} />
        </aside>
      )}
      
      <div className="flex-1">
        <main className="container mx-auto px-4 py-6">
          {/* Filter Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-900">Your Matches</h1>
            <button 
              onClick={toggleFilter}
              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
          
          <p className="text-gray-500 mb-6">Find your perfect roommate match!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Safely render recommendations */}
            {recommendations?.recommendations?.map((reco) => (
              <MatchCard 
                key={reco.user_id}
                recommendation={reco}
                onMessageClick={handleMessageClick}
                onLikeToggle={(userId, liked) => console.log(`User ${userId} liked: ${liked}`)}
              />
            ))}

            {/* Fallback if no recommendations */}
            {(!recommendations || recommendations.recommendations?.length === 0) && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No matches found. Try adjusting your filters.
              </div>
            )}
          </div>
        </main>

        <ChatWindow
          chats={chats}
          chatOpen={chatOpen}
          minimized={minimized}
          activeChat={activeChat}
          sidebarOpen={sidebarOpen}
          toggleChat={toggleChat}
          toggleMinimize={toggleMinimize}
          toggleSidebar={toggleSidebar}
          setActiveChat={setActiveChat}
        />
      </div>
    </div>
  );
}