'use client';

import { useState, useMemo } from 'react';
import { MessageCircle, Filter, ArrowRight } from 'lucide-react';
import { ChatWindow } from '@/components/Chat/ChatWindow';
import FilterSidebar from '@/components/filter-sidebar';
import { FilterUser } from '@/components/Filteruser';
import { useGetFilteredUsersQuery, useGetHouseFeedsQuery } from '@/store/profile';
import { useRouter } from 'next/navigation';
import { Pagination } from '@mantine/core';
import HouseFeedCard from '@/components/HouseFeedCard';

// Number of items per page - reduced for mobile
const ITEMS_PER_PAGE = 6;

export default function MatchesPage() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [activePage, setActivePage] = useState(1);
  
  const { data: allUsers, isLoading, isError } = useGetFilteredUsersQuery(filters);
  const { data: houseFeeds } = useGetHouseFeedsQuery({ limit: 5 });

  const paginatedUsers = useMemo(() => {
    if (!allUsers) return [];
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return allUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allUsers, activePage]);

  const totalPages = useMemo(() => {
    if (!allUsers) return 0;
    return Math.ceil(allUsers.length / ITEMS_PER_PAGE);
  }, [allUsers]);

  const handleMessageClick = (userId: string) => {
    const numericId = parseInt(userId, 10) || 1;
    setActiveChat(numericId);
    setChatOpen(true);
    setMinimized(false);
    setSidebarOpen(false);
  };

  const handleFiltersApplied = (newFilters: any) => {
    setFilters(newFilters);
    setActivePage(1);
    setShowFilter(false);
  };

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleFilter = () => setShowFilter(!showFilter);

  const navigateToHouseListing = () => {
    router.push('/houseListing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-purple-900">Loading matches...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-red-500">Error loading matches. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Filter Sidebar - Mobile Overlay */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowFilter(false)} 
          />
          <aside className="relative z-50 bg-white h-full w-full max-w-xs shadow-lg overflow-y-auto">
            <FilterSidebar 
              onClose={() => setShowFilter(false)}
              onFiltersApplied={handleFiltersApplied}
            />
          </aside>
        </div>
      )}
      
      <div className="flex-1">
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {/* Filter Button - Adjusted for mobile */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 px-2 sm:px-0">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-900">Find Your Matches</h1>
            <button 
              onClick={toggleFilter}
              className="flex items-center gap-1 sm:gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              <Filter size={16} className="sm:size-[18px]" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
          
          <p className="text-gray-500 mb-4 sm:mb-6 px-2 sm:px-0 text-sm sm:text-base">
            Find your perfect roommate match!
          </p>

          {/* Users Grid - Adjusted columns for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2 sm:px-0">
            {paginatedUsers?.map((user: any) => (
              <FilterUser 
                key={user.user_id}
                recommendation={user}
                onMessageClick={handleMessageClick}
                onLikeToggle={(userId, liked) => console.log(`User ${userId} liked: ${liked}`)}
              />
            ))}

            {(!paginatedUsers || paginatedUsers.length === 0) && (
              <div className="col-span-full text-center py-8 sm:py-10 text-gray-500 text-sm sm:text-base">
                No matches found. Try adjusting your filters.
              </div>
            )}
          </div>

          {/* Pagination - Adjusted for mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-8 sm:mb-12 px-2 sm:px-0">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                color="violet"
                radius="md"
                withEdges
                size="sm"
              />
            </div>
          )}

          {/* House Feeds Section - Adjusted for mobile */}
          <div className="mb-8 sm:mb-12 px-2 sm:px-0">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-purple-900">Available Houses</h2>
              <button 
                onClick={navigateToHouseListing}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">See all</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto pb-2 sm:pb-4 -mx-2 sm:-mx-4 px-2 sm:px-4 scrollbar-hide">
                <div className="flex space-x-3 sm:space-x-4">
                  {houseFeeds?.listings.map((house: any) => (
                    <div key={house._id} className="flex-shrink-0 w-64 sm:w-72">
                      <HouseFeedCard house={house} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Window - Adjusted for mobile */}
        <ChatWindow
          chats={[]}
          chatOpen={chatOpen}
          minimized={minimized}
          activeChat={activeChat}
          sidebarOpen={sidebarOpen}
          toggleChat={toggleChat}
          toggleMinimize={toggleMinimize}
          toggleSidebar={toggleSidebar}
          setActiveChat={setActiveChat}
          // className="fixed bottom-4 right-4 md:relative md:bottom-auto md:right-auto"
        />
      </div>
    </div>
  );
}