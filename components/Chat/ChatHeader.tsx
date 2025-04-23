'use client';

import { MessageCircle, Phone, ArrowLeft, Menu } from "lucide-react";
import { UserAvatar } from "../UserAvatar";

interface ChatHeaderProps {
  name: string;
  online: boolean;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const ChatHeader = ({ name, online, sidebarOpen, toggleSidebar }: ChatHeaderProps) => {
  return (
    <div className="p-3 border-b flex justify-between items-center">
      <div className="flex items-center space-x-2">
        {!sidebarOpen && (
          <button 
            className="text-gray-500 hover:text-gray-700 p-1 mr-1"
            onClick={toggleSidebar}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <UserAvatar name={name} />
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-xs text-green-500">{online ? 'Online' : 'Offline'}</p>
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
  );
};