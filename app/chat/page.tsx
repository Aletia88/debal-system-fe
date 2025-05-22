'use client'
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import ChatHeader from "./components/ChatHeader";
import { useGetConversationsQuery } from "@/store/chat";
import { useGetProfileQuery } from "@/store/profile";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Flex } from "@mantine/core";
import MobileChatLayout from "./components/mobileView";
import { useMediaQuery } from "@mantine/hooks";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [selectedUserForNewChat, setSelectedUserForNewChat] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const searchParams = useSearchParams();
  const newChatUserId = searchParams.get('newChat');
  

  const { data: user } = useGetProfileQuery({});
  const { data: conversations, isLoading: isLoadingConversations } = useGetConversationsQuery({}, {
    pollingInterval: 1000, // Refetch every 2 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (newChatUserId) {
      // Check if conversation already exists with this user
      const existingConversation = conversations?.data.find((conv:any) => 
        conv.otherParticipant._id === newChatUserId
      );
      
      if (existingConversation) {
        setActiveChat(existingConversation._id);
      } else {
        setSelectedUserForNewChat(newChatUserId);
        setShowNewChatDialog(true);
      }
    }
  }, [newChatUserId, conversations]);

  return (
    <div className="h-screen flex flex-col">

     {!activeChat && <ChatHeader 
        onNewChat={() => setShowNewChatDialog(true)}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />}
      
      {/* <div className="flex flex-1 overflow-hidden"> */}
      {isMobile ? (
      <MobileChatLayout
        conversations={conversations?.data || []}
        isLoading={false}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        currentUserId={user?.user._id}
        renderChatWindow={() => (
          <ChatWindow
        setActiveChat={setActiveChat}
          activeChat={activeChat}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          showNewChatDialog={false}
          setShowNewChatDialog={setShowNewChatDialog}
          currentUserId={user?.user._id}
          preselectedUserId={selectedUserForNewChat}
          onNewChatCreated={() => {
            setSelectedUserForNewChat(null);
            // Remove the query parameter after handling
            window.history.replaceState(null, '', '/chat');
          }}
        />
        )}
      />
    ) : (
      <Flex wrap='nowrap' className="overflow-hidden h-full">
        {sidebarOpen && (
          <ChatSidebar
            conversations={conversations?.data || []}
            isLoading={isLoadingConversations}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            currentUserId={user?.user._id}
          />
        )}
        
        <ChatWindow
        setActiveChat={setActiveChat}
          activeChat={activeChat}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          showNewChatDialog={showNewChatDialog}
          setShowNewChatDialog={setShowNewChatDialog}
          currentUserId={user?.user._id}
          preselectedUserId={selectedUserForNewChat}
          onNewChatCreated={() => {
            setSelectedUserForNewChat(null);
            // Remove the query parameter after handling
            window.history.replaceState(null, '', '/chat');
          }}
        />
        </Flex>
    )}
      {/* </div> */}
    </div>
  );
}