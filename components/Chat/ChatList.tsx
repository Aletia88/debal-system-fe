'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "../UserAvatar";
import { Chat } from "@/types/chat";

interface ChatListProps {
  chats: Chat[];
  activeChat: number | null;
  setActiveChat: (id: number) => void;
}

export const ChatList = ({ chats, activeChat, setActiveChat }: ChatListProps) => {
  return (
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
        <div className="divide-y">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer ${activeChat === chat.id ? 'bg-purple-50' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="flex items-start space-x-3">
                <UserAvatar name={chat.name} />
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
  );
};