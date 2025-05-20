'use client'
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import ChatHeader from "./components/ChatHeader";
import { useGetConversationsQuery } from "@/store/chat";
import { useGetProfileQuery } from "@/store/profile";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [selectedUserForNewChat, setSelectedUserForNewChat] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const newChatUserId = searchParams.get('newChat');

  const { data: user } = useGetProfileQuery({});
  const { data: conversations, isLoading: isLoadingConversations } = useGetConversationsQuery({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (newChatUserId) {
      // Check if conversation already exists with this user
      const existingConversation = conversations?.data.find(conv => 
        conv.participant._id === newChatUserId
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
    <>
      <ChatHeader 
        onNewChat={() => setShowNewChatDialog(true)}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
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
      </div>
    </>
  );
}