import { useState, useRef, useEffect } from "react";
import { useGetConversationMessagesQuery, useSendMessageMutation, useMarkMessagesAsReadMutation } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ChevronLeft, MoreVertical, Paperclip, Mic, MessageCircle, Loader2, AlignJustify } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import NewChatDialog from "./NewChatDialog";
import { IconBurger } from "@tabler/icons-react";

interface ChatWindowProps {
  setActiveChat: (id: string) => void;
  activeChat: string | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  showNewChatDialog: boolean;
  setShowNewChatDialog: (show: boolean) => void;
  currentUserId: string;
  preselectedUserId?: string | null;
  onNewChatCreated: () => void;
}

interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  messageType: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { data: messagesResponse, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery(activeChat || "", {
    skip: !activeChat,
    pollingInterval: 1000
  });
  
  const [sendMessage] = useSendMessageMutation();

  const messages: Message[] = messagesResponse?.data || [];

  useEffect(() => {
    if (activeChat && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => !msg.read && msg.sender._id !== currentUserId
      );
      if (unreadMessages.length > 0) {
        markMessagesAsRead({ messageIds: unreadMessages.map((msg) => msg._id) });
      }
    }
  }, [activeChat, messages, currentUserId, markMessagesAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && activeChat) {
      try {
        setIsSending(true);
        await sendMessage({
          conversationId: activeChat, 
          content: {
            content: message,
            messageType: "text",
            conversationId: activeChat
          }
        }).unwrap();
        setMessage("");
        await refetchMessages();
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <>
      <NewChatDialog 
        open={showNewChatDialog} 
        onOpenChange={(open) => {
          setShowNewChatDialog(open);
          if (!open) onNewChatCreated();
        }}
        preselectedUserId={preselectedUserId}
        onConversationCreated={(conversationId) => {
          setActiveChat(conversationId);
          refetchMessages();
        }}
      />
      
      {/* Main chat container - fixed width that works with sidebar */}
      <div className={`flex-1 flex flex-col h-screen `}>
        <div className="flex flex-col h-full bg-[#e6ebee] w-full">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-3 bg-[#fff] text-black flex items-center sticky top-0 z-10 h-[60px] w-full">
                {isMobile && (
                  <button onClick={()=>setActiveChat('')} className="mr-2">
                    <AlignJustify color="#9F12E0" size={24} />
                  </button>
                )}
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold truncate">Chat Name</h2>
                  <p className="text-xs opacity-80 truncate">last seen recently</p>
                </div>
                <button>
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide    p-4 w-full h-full md:mt-12" >
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse">Loading messages...</div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div key={msg._id} className={`flex mb-3 w-full ${msg.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender._id !== currentUserId && (
                          <Avatar className="h-8 w-8 mr-2 self-end flex-shrink-0">
                            <AvatarImage src={msg.sender.avatar} />
                            <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-lg max-w-[80%] ${
                            msg.sender._id === currentUserId
                              ? 'bg-[#8C10C5] text-white rounded-br-none'
                              : 'bg-white rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <div className={`text-xs mt-1 flex items-center ${
                            msg.sender._id === currentUserId ? 'text-blue-100 justify-end' : 'text-gray-500 justify-start'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              <div className="p-2 bg-white border-t sticky bottom-0 h-[60px] w-full">
                <div className="flex items-center h-full w-full max-w-full">
                  <button className="p-2 text-gray-500 flex-shrink-0">
                    <Paperclip size={20} />
                  </button>
                  <div className="flex-1 mx-2 min-w-0">
                    <Input
                      placeholder="Message"
                      className="rounded-full bg-gray-100 border-none w-full"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 min-w-[40px] flex-shrink-0"
                    disabled={!message.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyChatState 
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </>
  );
}

function EmptyChatState({ sidebarOpen, toggleSidebar, isMobile }: { sidebarOpen: boolean, toggleSidebar: () => void, isMobile?: boolean }) {
  return (
    <div className="flex-1 flex flex-col h-screen bg-[#e6ebee]">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-6 max-w-full">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No chat selected</h3>
          <p className="mt-1 text-gray-500">Select a chat to start messaging</p>
          {!sidebarOpen && isMobile && (
            <Button
              onClick={toggleSidebar}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Open Chat List
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}