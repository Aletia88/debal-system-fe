import { useState, useRef, useEffect } from "react";
import { useGetConversationMessagesQuery, useSendMessageMutation, useMarkMessagesAsReadMutation } from "@/store/chat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Menu, ChevronLeft, MoreVertical, Paperclip, Mic, Check, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flex } from "@mantine/core";
import NewChatDialog from "./NewChatDialog";
import { useSocket } from "@/context/socketContext";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation();
  const { socket } = useSocket();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useGetConversationMessagesQuery(activeChat || "", {
    skip: !activeChat
  });
  
  const [sendMessageApi] = useSendMessageMutation();

  // Initialize messages and join conversation room
  useEffect(() => {
    if (!activeChat || !socket) return;

    setLocalMessages(messages);
    
    // Join the conversation room
    socket.emit('joinConversation', activeChat);

    return () => {
      // Leave the conversation room when component unmounts or activeChat changes
      socket.emit('leaveConversation', activeChat);
    };
  }, [activeChat, socket, messages]);

  // Handle receiving new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      setLocalMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  // Mark messages as read when they're displayed
  useEffect(() => {
    if (activeChat && localMessages.length > 0) {
      const unreadMessages = localMessages.filter(
        (msg) => !msg.read && msg.sender._id !== currentUserId
      );
      if (unreadMessages.length > 0) {
        const unreadMessageIds = unreadMessages.map((msg) => msg._id);
        markMessagesAsRead({ messageIds: unreadMessageIds });
      }
    }
  }, [activeChat, localMessages, currentUserId, markMessagesAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);
  
  const groupedMessages = localMessages.reduce((groups: any[], message) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.sender._id === message.sender._id) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        sender: message.sender,
        messages: [message]
      });
    }
    return groups;
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && activeChat && socket) {
      try {
        // Create temporary message for optimistic UI
        const tempMessage = {
          _id: Date.now().toString(), // temporary ID
          content: message,
          sender: { _id: currentUserId },
          createdAt: new Date().toISOString(),
          read: false,
          isOptimistic: true
        };

        // Optimistically add to local messages
        setLocalMessages(prev => [...prev, tempMessage]);
        setMessage("");
        scrollToBottom();

        // Emit via socket
        socket.emit('sendMessage', {
          conversationId: activeChat,
          content: message,
          senderId: currentUserId
        });

        // Also send to API for persistence
        await sendMessageApi({
          conversationId: activeChat, 
          content: {
            content: message,
            messageType: "text",
            conversationId: activeChat
          }
        });

        // Refetch to replace optimistic message with real one
        refetchMessages();
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove optimistic message if failed
        setLocalMessages(prev => prev.filter(msg => !msg.isOptimistic));
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
      
      <div className={`flex-1 flex flex-col h-full bg-[#e6ebee]`}>
        {activeChat ? (
          <>
            {/* Telegram-like header */}
            <div className="p-3 bg-blue-500 text-white flex items-center sticky top-0 z-10">
              {isMobile && (
                <button onClick={toggleSidebar} className="mr-2">
                  <ChevronLeft size={24} />
                </button>
              )}
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">Chat Name</h2>
                <p className="text-xs opacity-80">last seen recently</p>
              </div>
              <button>
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse">Loading messages...</div>
                </div>
              ) : (
                groupedMessages.map((group, index) => (
                  <div key={index} className={`mb-4 ${group.sender._id === currentUserId ? 'items-end' : 'items-start'}`}>
                    {group.sender._id !== currentUserId && (
                      <div className="flex items-center mb-1">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={group.sender.avatar} />
                          <AvatarFallback>{group.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{group.sender.name}</span>
                      </div>
                    )}
                    
                    <div className={`flex flex-col ${group.sender._id === currentUserId ? 'items-end' : 'items-start'}`}>
                      {group.messages.map((msg: any) => (
                        <div
                          key={msg._id}
                          className={`p-3 mb-1 rounded-lg max-w-[80%] ${
                            group.sender._id === currentUserId
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-white rounded-bl-none'
                          } ${msg.isOptimistic ? 'opacity-80' : ''}`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className={`text-xs mt-1 flex items-center ${
                            group.sender._id === currentUserId ? 'text-blue-100 justify-end' : 'text-gray-500 justify-start'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {group.sender._id === currentUserId && !msg.isOptimistic && (
                              <Flex wrap='nowrap' className="ml-1">
                                <Check 
                                  size={12} 
                                  className={msg.read ? 'text-blue-300' : 'text-blue-100'} 
                                />
                                {msg.read && (
                                  <Check 
                                    size={12} 
                                    className="-ml-1 text-blue-300" 
                                    strokeWidth={3}
                                  />
                                )}
                              </Flex>
                            )}
                            {msg.isOptimistic && (
                              <span className="text-xs ml-1">Sending...</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Telegram-like input area */}
            <div className="p-2 bg-white border-t sticky bottom-0">
              <div className="flex items-center">
                <button className="p-2 text-gray-500">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 mx-2">
                  <Input
                    placeholder="Message"
                    className="rounded-full bg-gray-100 border-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                </div>
                {message ? (
                  <Button 
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <Send size={20} />
                  </Button>
                ) : (
                  <button className="p-2 text-gray-500">
                    <Mic size={20} />
                  </button>
                )}
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
    </>
  );
}

function EmptyChatState({ sidebarOpen, toggleSidebar, isMobile }: { sidebarOpen: boolean, toggleSidebar: () => void, isMobile?: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#e6ebee]">
      <div className="text-center p-6">
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
  );
}

// Add this hook to your hooks folder
