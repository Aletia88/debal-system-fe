'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Filter } from 'lucide-react'; // Added Filter icon
import { MatchCard } from '@/components/MatchCard';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import { useChat } from '@/hooks/useChat';
import { Chat } from '@/types/chat';
import FilterSidebar from '@/components/filter-sidebar';

const matches = [
  { id: 1, name: "Rebecca Oyebanji", matchPercentage: 80, image: "/image.png" },
  { id: 2, name: "Alex Johnson", matchPercentage: 75, image: "/image.png" },
  { id: 3, name: "Sarah Williams", matchPercentage: 90, image: "/image.png" },
  { id: 4, name: "Michael Brown", matchPercentage: 65, image: "/image.png" },
];

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
  const [showFilter, setShowFilter] = useState(false); // Changed to false by default

  const handleMessageClick = (userId: number) => {
    setActiveChat(userId);
    setChatOpen(true);
    setMinimized(false);
    setSidebarOpen(false);
  };

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilter = () => setShowFilter(!showFilter); // Added toggle function

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Filter Sidebar */}
      {showFilter && (
        <aside className=" bg-white shadow-md transition-all duration-300 ease-in-out">
          <FilterSidebar onClose={() => setShowFilter(false)} />
        </aside>
      )}
      
      <div className="flex-1">
        <main className="container mx-auto  px-4 py-6">
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
          
          <p className="text-gray-500 mb-6">Holla!, Fill in the details to complete sign up</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((user) => (
              <MatchCard 
              user={{
                id: 1,
                name: "Rebecca Oyebanji",
                matchPercentage: 80,
                image: "/image.png",
                age: 28,
                location: "New York",
                bio: "Love hiking and photography. Looking for someone to share adventures with!",
                interests: ["Hiking", "Photography", "Travel"]
              }}
              onMessageClick={handleMessageClick}
              onLikeToggle={(userId, liked) => console.log(`User ${userId} liked: ${liked}`)}
            />
            ))}
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