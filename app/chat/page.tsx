'use client'
import Image from "next/image";
import { Bell, Search, ChevronDown, Minimize2, X, Eye, Heart, MessageCircle, Send, Phone, Check, Maximize2, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Draggable from "react-draggable";
import { useState } from "react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const chats = [
    { id: 1, name: "Rebecca Oyebanji", lastMessage: "You are you! When do you plan on moving...", unread: 3, online: true },
    { id: 2, name: "Alex Johnson", lastMessage: "Hey, how are you doing?", unread: 0, online: false },
    { id: 3, name: "Sarah Williams", lastMessage: "Let's meet tomorrow", unread: 1, online: true },
    { id: 4, name: "Michael Brown", lastMessage: "Thanks for the info!", unread: 0, online: false },
    { id: 5, name: "Emily Davis", lastMessage: "Did you see the news?", unread: 2, online: true },
    { id: 6, name: "David Miller", lastMessage: "Call me when you're free", unread: 0, online: false },
  ];

  return (
    <div className="max-h-screen m-5 bg-gray-50">
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="p-3 border-b flex justify-between items-center bg-purple-50 cursor-move">
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-lg text-purple-900">Messages</h2>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden h-[calc(100vh-150px)]">
          {/* Sidebar - Only this part scrolls */}
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
              <div className="flex-1 overflow-y-auto"> {/* Added overflow-y-auto here */}
                <div className="divide-y">
                  {chats.map((chat) => (
                    <div 
                      key={chat.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${activeChat === chat.id ? 'bg-purple-50' : ''}`}
                      onClick={() => setActiveChat(chat.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {chat.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{chat.name}</h4>
                            {chat.unread > 0 && (
                              <span className="text-purple-600 bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          {chat.online && (
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
              </div>
            </div>
          )}

          {/* Main Chat Area - Fixed height */}
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
                        {chats.find(c => c.id === activeChat)?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{chats.find(c => c.id === activeChat)?.name}</h4>
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
                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-sm">
                      Digital Technology is vulnerable in my country because there are alot of things one can not control
                      outside the country, its messed up, what i am writing is messeup too. never mind
                    </p>
                    <div className="text-xs text-right text-gray-500 mt-1 flex items-center justify-end">
                      9:00 PM <Check size={12} className="ml-1 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg shadow-sm max-w-[80%] ml-auto">
                    <p className="text-sm">I understand. That sounds frustrating. Maybe we can find a solution together?</p>
                    <div className="text-xs text-right text-gray-500 mt-1 flex items-center justify-end">
                      9:02 PM <Check size={12} className="ml-1 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                    <p className="text-sm">
                      Thanks for understanding. It's just been really challenging lately.
                    </p>
                    <div className="text-xs text-right text-gray-500 mt-1 flex items-center justify-end">
                      9:05 PM <Check size={12} className="ml-1 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="relative">
                    <Input placeholder="Type your message here..." className="pr-12 rounded-full" />
                    <Button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600">
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