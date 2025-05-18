'use client'
import Image from "next/image";
import { Bell, Search, ChevronDown, Minimize2, X, Eye, Heart, MessageCircle, Send, Phone, Check, Maximize2, Menu, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import Draggable from "react-draggable";

// import { useGetConversationsQuery, useGetConversationMessagesQuery, useSendMessageMutation } from 
import { useEffect, useState } from "react";
import { useGetConversationsQuery, useGetConversationMessagesQuery, useSendMessageMutation, useCreateConversationMutation, useGetUsersQuery } from "@/store/chat";
// ... other imports

export default function Home() {
  const [chatOpen, setChatOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch conversations
  const { data: conversations, isLoading: isLoadingConversations } = useGetConversationsQuery({});

  // Fetch messages for active conversation
  const { data: messages = [], isLoading: isLoadingMessages } = useGetConversationMessagesQuery(activeChat || "", {
    skip: !activeChat
  });

  // Send message mutation
  const [sendMessage] = useSendMessageMutation();

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery({});
  const users = usersResponse?.data || [];
  
  // Add the create conversation mutation
  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  // Mock users data - replace with actual user search API call
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: '' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (message.trim() && activeChat) {
      try {
        await sendMessage({ conversationId: activeChat, content: { 
          content: message,
          messageType: "text", // Explicitly set message type
          conversationId: activeChat 
        } });
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };


  const handleCreateConversation = async () => {
    if (selectedUser) {
      try {
        const result = await createConversation(selectedUser).unwrap();
        console.log(result)
        setActiveChat(result.data._id); // Switch to the new conversation
        setShowNewChatDialog(false);
        setSearchQuery("");
        setSelectedUser(null);
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    }
  };
  return (
    <div className="max-h-screen m-5 bg-gray-50">
      <div className="border rounded-lg bg-white shadow-sm">
        {/* Header */}
        <div className="p-3 border-b flex justify-between items-center bg-purple-50">
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-lg text-purple-900">Messages</h2>
          </div>
          <Button 
            onClick={() => setShowNewChatDialog(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <Plus size={16} className="mr-1" /> New Chat
          </Button>
        </div>

        {/* New Chat Dialog */}
        {showNewChatDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">New Conversation</h3>
                <button 
                  onClick={() => {
                    setShowNewChatDialog(false);
                    setSearchQuery("");
                    setSelectedUser(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    className="pl-9 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto mb-4 border rounded-lg">
                {isLoadingUsers ? (
                  <div className="p-4 text-center">Loading users...</div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <div
                      key={user._id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 ${
                        selectedUser === user._id ? 'bg-purple-50' : ''
                      }`}
                      onClick={() => setSelectedUser(user._id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        {user.isOnline && (
                          <div className="flex items-center mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            <span className="text-xs text-gray-500">Online</span>
                          </div>
                        )}
                      </div>
                      {selectedUser === user._id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    {debouncedSearch ? "No users found" : "Start typing to search users"}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewChatDialog(false);
                    setSearchQuery("");
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateConversation}
                  disabled={!selectedUser || isCreatingConversation}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isCreatingConversation ? "Creating..." : "Start Chat"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden h-[calc(100vh-150px)]">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="w-64 border-r flex flex-col">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search chats..." 
                    className="pl-9 rounded-full bg-gray-100 border-none" 
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoadingConversations ? (
                  <div className="p-4 text-center">Loading conversations...</div>
                ) : (
                  <div className="divide-y">
                    {conversations?.data.map((conversation) => (
                      <div 
                        key={conversation.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer ${activeChat === conversation._id ? 'bg-purple-50' : ''}`}
                        onClick={() => setActiveChat(conversation._id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={conversation.avatar || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>
                              {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                              {conversation.unreadCount > 0 && (
                                <span className="text-purple-600 bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.content || "No messages yet"}</p>
                            {conversation.isOnline && (
                              <div className="flex items-center mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                <span className="text-xs text-gray-500">Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col ${!sidebarOpen ? 'w-full' : ''}`}>
            {activeChat ? (
              <>
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
                      <AvatarFallback>
                        {conversations.data.participant?.find(c => c._id === activeChat)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">
                        {conversations.data.participant?.find(c => c._id === activeChat)?.name}
                      </h4>
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
                      <div 
                        key={msg.id}
                        className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                          msg.isCurrentUser ? 'bg-orange-50 ml-auto' : 'bg-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="text-xs text-right text-gray-500 mt-1 flex items-center justify-end">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.isCurrentUser && <Check size={12} className="ml-1 text-purple-600" />}
                        </div>
                      </div>
                    ))
                  )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}