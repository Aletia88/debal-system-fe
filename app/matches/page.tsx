'use client';

import { useState } from 'react';
import { MessageCircle, Filter } from 'lucide-react';
import { MatchCard } from '@/components/MatchCard';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import FilterSidebar from '@/components/filter-sidebar';
import { useGetProfileByRecommendationQuery } from '@/store/profile';

export default function MatchesPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  
  // Use the filters in the query
  const { data: recommendations, isLoading, isError } = useGetProfileByRecommendationQuery(filters);

  const handleMessageClick = (userId: string) => {
    const numericId = parseInt(userId, 10) || 1;
    setActiveChat(numericId);
    setChatOpen(true);
    setMinimized(false);
    setSidebarOpen(false);
  };

  const handleFiltersApplied = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilter(false);
  };

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilter = () => setShowFilter(!showFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-purple-900">Loading matches...</div>
      </div>
    );
  }

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
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
          <aside className="relative z-50 bg-white h-full w-full max-w-md shadow-lg">
            <FilterSidebar 
              onClose={() => setShowFilter(false)}
              onFiltersApplied={handleFiltersApplied}
            />
          </aside>
        </div>
      )}
      
      <div className="flex-1">
        <main className="container mx-auto px-4 py-6">
          {/* Filter Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-purple-900">Your Matches</h1>
            {/* <button 
              onClick={toggleFilter}
              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={18} />
              Filters
            </button> */}
          </div>
          
          <p className="text-gray-500 mb-6">Find your perfect roommate match!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations?.recommendations?.map((reco: any) => (
              <MatchCard 
                key={reco.user_id}
                recommendation={reco}
                onMessageClick={handleMessageClick}
                onLikeToggle={(userId, liked) => console.log(`User ${userId} liked: ${liked}`)}
              />
            ))}

            {(!recommendations || recommendations.recommendations?.length === 0) && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No matches found. Try adjusting your filters.
              </div>
            )}
          </div>
        </main>

        <ChatWindow
          chats={[]} // You might want to replace this with actual chat data
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