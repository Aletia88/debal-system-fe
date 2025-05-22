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

// Number of items per page
const ITEMS_PER_PAGE = 9;

export default function MatchesPage() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [activePage, setActivePage] = useState(1);
  
  // Get all users without pagination parameters
  const { data: allUsers, isLoading, isError } = useGetFilteredUsersQuery(filters);
  const { data: houseFeeds } = useGetHouseFeedsQuery({ limit: 5 });

  // Calculate paginated users
  const paginatedUsers = useMemo(() => {
    if (!allUsers) return [];
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return allUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allUsers, activePage]);

  // Calculate total pages
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
    setActivePage(1); // Reset to first page when filters change
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
       {/* Semi-transparent overlay that closes the filter when clicked */}
       <div 
         className="absolute inset-0 bg-black/50" 
         onClick={() => setShowFilter(false)} 
       />
       
       {/* Scrollable filter sidebar */}
       <aside className="relative z-50 bg-white h-full w-full max-w-md shadow-lg overflow-y-auto scrollbar-hide">
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
            <button 
              onClick={toggleFilter}
              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
          
          <p className="text-gray-500 mb-6">Find your perfect roommate match!</p>

          {/* Users Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedUsers?.map((user: any) => (
              <FilterUser 
                key={user.user_id}
                recommendation={user}
                onMessageClick={handleMessageClick}
                onLikeToggle={(userId, liked) => console.log(`User ${userId} liked: ${liked}`)}
              />
            ))}

            {(!paginatedUsers || paginatedUsers.length === 0) && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No matches found. Try adjusting your filters.
              </div>
            )}
          </div>

          {/* Pagination - Only show if we have more than one page */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-12">
              <Pagination
                total={totalPages}
                value={activePage}
                onChange={setActivePage}
                color="violet"
                radius="md"
                withEdges
              />
            </div>
          )}

          {/* House Feeds Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-900">Available Houses</h2>
              <button 
                onClick={navigateToHouseListing}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors"
              >
                See all <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <div className="flex space-x-4">
                  {houseFeeds?.listings.map((house: any) => (
                    <div key={house._id} className="flex-shrink-0 w-72">
                      <HouseFeedCard house={house} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

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
        />
      </div>
    </div>
  );
}