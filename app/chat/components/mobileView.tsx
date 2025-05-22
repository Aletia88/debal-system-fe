import { useState } from "react";
import { ChevronLeft, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import NewChatDialog from "./NewChatDialog";
import { Button } from "@/components/ui/button";

interface MobileChatLayoutProps {
  conversations: any[];
  isLoading: boolean;
  activeChat: string | null;
  setActiveChat: (id: string) => void;
  currentUserId: string;
  renderChatWindow: () => React.ReactNode;
}

export default function MobileChatLayout({
  conversations,
  isLoading,
  activeChat,
  setActiveChat,
  currentUserId,
  renderChatWindow
}: MobileChatLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      conversation.otherParticipant.name.toLowerCase().includes(searchLower) ||
      (conversation.lastMessage?.content || "").toLowerCase().includes(searchLower)
    );
  });

  // On mobile, we show either sidebar OR chat window, not both
  if (isMobile && activeChat) {
    return (
      <div className="flex flex-col h-screen">
        {/* Mobile chat header with back button */}
        {/* <div className="p-3 bg-blue-500 text-white flex items-center sticky top-0 z-10">
          <button 
            onClick={() => setActiveChat(null)} 
            className="mr-2"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold">Back to chats</h2>
          </div>
        </div> */}
        
        {/* Render the chat window */}
        {renderChatWindow()}
      </div>
    );
  }

  // Default mobile view (sidebar only)
  return (
    <div className="w-full h-screen flex flex-col">
      {/* New Chat Dialog - now properly included in mobile view */}
      <NewChatDialog 
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onConversationCreated={(conversationId) => {
          setActiveChat(conversationId);
          setShowNewChatDialog(false);
        }}
      />
      
      <div className="p-3 border-b flex items-center justify-between">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            className="pl-9 rounded-full bg-gray-100 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setShowNewChatDialog(true)}
          className="rounded-full p-2 h-10 w-10 text-[white] bg-[#9F12E0]"
          size="icon"
        >
          <Plus size={20} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="p-4 text-center">Loading conversations...</div>
        ) : (
          <div className="divide-y">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${activeChat === conversation._id ? 'bg-purple-50' : ''}`}
                  onClick={() => setActiveChat(conversation._id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {conversation.otherParticipant.name.split(' ').map((n:any) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">{conversation.otherParticipant.name}</h4>
                        {conversation.unreadCount > 0 && (
                          <span className="text-purple-600 bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}