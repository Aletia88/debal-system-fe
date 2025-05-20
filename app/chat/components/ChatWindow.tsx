import { useState, useRef, useEffect } from "react";
import { useGetConversationMessagesQuery, useSendMessageMutation, useMarkMessagesAsReadMutation } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Menu, MessageCircle, Phone, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flex } from "@mantine/core";
import NewChatDialog from "./NewChatDialog";

interface ChatWindowProps {
    setActiveChat: (id: string) => void;
  activeChat: string | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  showNewChatDialog: boolean;
  setShowNewChatDialog: (show: boolean) => void;
  currentUserId: string;
}

export default function ChatWindow({
    setActiveChat,
  activeChat,
  sidebarOpen,
  toggleSidebar,
  showNewChatDialog,
  setShowNewChatDialog,
  currentUserId,
  preselectedUserId,
  onNewChatCreated
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery(activeChat || "", {
    skip: !activeChat
  });
  
  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    if (activeChat && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg:any) => !msg.read && msg.sender._id !== currentUserId
      );
      if (unreadMessages.length > 0) {
        const unreadMessageIds = unreadMessages.map((msg:any) => msg._id);
        markMessagesAsRead({ messageIds: unreadMessageIds });
      }
    }
  }, [activeChat, messages, currentUserId, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && activeChat) {
      try {
        await sendMessage({
          conversationId: activeChat, 
          content: {
            content: message,
            messageType: "text",
            conversationId: activeChat
          }
        });
        setMessage("");
        refetchMessages();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <>
      {/* <NewChatDialog 
  open={showNewChatDialog} 
  onOpenChange={setShowNewChatDialog}
  onConversationCreated={(conversationId) => {
    setActiveChat(conversationId);
    // You might also want to refetch conversations here
    // refetchConversations();
    refetchMessages()
  }}
/> */}
<NewChatDialog 

        open={showNewChatDialog} 
        onOpenChange={(open) => {
          setShowNewChatDialog(open);
          if (!open) {
            onNewChatCreated();
          }
        }}
        preselectedUserId={preselectedUserId}
        onConversationCreated={(conversationId) => {
            setActiveChat(conversationId);
            // You might also want to refetch conversations here
            // refetchConversations();
            refetchMessages()
          }}
      />
      
      <div className={`flex-1 flex flex-col ${!sidebarOpen ? 'w-full' : ''} h-full`}>
        {activeChat ? (
          <>
            {/* Chat header and messages */}
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {!sidebarOpen && (
                  <button
                    className="text-gray-500 hover:text-gray-700 p-1 mr-1"
                    onClick={toggleSidebar}
                  >
                    <Menu size={18} />
                  </button>
                )}
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">User Name</h4>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-200 rounded-full">
                  <MessageCircle size={18} className="text-purple-600" />
                </button>
                <button className="p-2 bg-gray-200 rounded-full">
                  <Phone size={18} className="text-purple-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {isLoadingMessages ? (
                <div className="text-center p-4">Loading messages...</div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble 
                    key={msg._id}
                    message={msg}
                    isCurrentUser={msg.sender._id === currentUserId}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="relative">
                <Input
                  placeholder="Type your message here..."
                  className="pr-12 rounded-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600"
                  onClick={handleSendMessage}
                >
                  <Send size={16} className="text-white" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyChatState 
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}
      </div>
    </>
  );
}

function MessageBubble({ message, isCurrentUser }: { message: any, isCurrentUser: boolean }) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-1 pb-2 pr-20 rounded-lg shadow-sm max-w-[80%] min-w-32 relative ${
          isCurrentUser 
            ? 'bg-blue-100 rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        } ${!message.isRead && isCurrentUser ? 'border border-blue-200' : ''}`}
      >
        <p className="text-sm pr-2">{message.content}</p>
        <div className={`text-xs mt-1 pl-2 flex items-center absolute bottom-1 right-2 ${
          isCurrentUser 
            ? 'text-right justify-end text-gray-500' 
            : 'text-left justify-start text-gray-400'
        }`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isCurrentUser && (
            <Flex wrap='nowrap' className="ml-1">
              <Check 
                size={12} 
                className={message.isRead ? 'text-blue-500' : 'text-gray-400'} 
              />
              {message.read && (
                <Check 
                  size={12} 
                  className="-ml-1 text-blue-500" 
                  strokeWidth={3}
                />
              )}
            </Flex>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyChatState({ sidebarOpen, toggleSidebar }: { sidebarOpen: boolean, toggleSidebar: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No chat selected</h3>
        <p className="mt-1 text-gray-500">Select a chat from the sidebar to start messaging</p>
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Open Chat List
          </button>
        )}
      </div>
    </div>
  );
}