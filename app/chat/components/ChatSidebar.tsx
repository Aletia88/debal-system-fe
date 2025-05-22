import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatSidebarProps {
  conversations: any[];
  isLoading: boolean;
  activeChat: string | null;
  setActiveChat: (id: string) => void;
  currentUserId: string;
}

export default function ChatSidebar({
  conversations,
  isLoading,
  activeChat,
  setActiveChat,
  currentUserId
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      conversation.otherParticipant.name.toLowerCase().includes(searchLower) ||
      (conversation.lastMessage?.content || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={`w-64 border-r flex flex-col h-full  ${activeChat ? 'mt-14' : 'mt-0'}`}>
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            className="pl-9 rounded-full bg-gray-100 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                      <AvatarImage src={conversation.avatar || "/placeholder.svg?height=40&width=40"} />
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
                      {conversation.isOnline && (
                        <div className="flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          <span className="text-xs text-gray-500">Online</span>
                        </div>
                      )}
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