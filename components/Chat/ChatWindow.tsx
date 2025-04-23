'use client';

import { useState } from 'react';
import Draggable from 'react-draggable';
import { X, Menu, MessageCircle } from 'lucide-react';
import { Chat } from '@/types/chat';
import { ChatList } from './ChatList';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  chats: Chat[];
  chatOpen: boolean;
  minimized: boolean;
  activeChat: number | null;
  sidebarOpen: boolean;
  toggleChat: () => void;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
  setActiveChat: (id: number | null) => void;
}

export const ChatWindow = ({
    chats,
    chatOpen,
    minimized,
    activeChat,
    sidebarOpen,
    toggleChat,
    toggleMinimize,
    toggleSidebar,
    setActiveChat,
  }: ChatWindowProps) => {
    const currentChat = chats.find(c => c.id === activeChat);
  
    if (!chatOpen) return null;
  return (
    <Draggable handle=".drag-handle" bounds="parent">
      <div className={`fixed ${minimized ? 'bottom-0 right-0 w-80' : 'right-4 bottom-4 w-[800px]'} bg-white rounded-t-lg shadow-lg overflow-hidden flex flex-col z-50`} style={{ height: '70vh' }}>
        {/* Header - drag handle */}
        <div className="p-3 border-b flex justify-between items-center bg-purple-50 drag-handle cursor-move">
          <div className="flex items-center space-x-2">
            <button 
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={toggleSidebar}
            >
              <Menu size={18} />
            </button>
            <h2 className="font-bold text-lg text-purple-900">
              {activeChat ? `Chat with ${currentChat?.name}` : 'Chats'}
            </h2>
          </div>
          <div className="flex space-x-2">
            <button 
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={toggleChat}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Chat List */}
            {sidebarOpen && (
              <ChatList 
                chats={chats} 
                activeChat={activeChat} 
                setActiveChat={(id) => setActiveChat(id)} 
              />
            )}

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col ${!sidebarOpen ? 'w-full' : ''}`}>
              {activeChat ? (
                <>
                  <ChatHeader 
                    name={currentChat?.name || ''} 
                    online={currentChat?.online || false} 
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />

                  {/* Messages - scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    <MessageBubble
                      text="Digital Technology is vulnerable in my country because there are alot of things one can not control outside the country, its messed up, what i am writing is messeup too. never mind"
                      time="9:00 PM"
                      isCurrentUser={false}
                      isRead={true}
                    />
                    <MessageBubble
                      text="I understand. That sounds frustrating. Maybe we can find a solution together?"
                      time="9:02 PM"
                      isCurrentUser={true}
                      isRead={true}
                    />
                    <MessageBubble
                      text="Thanks for understanding. It's just been really challenging lately."
                      time="9:05 PM"
                      isCurrentUser={false}
                      isRead={true}
                    />
                  </div>

                  <MessageInput />
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
        )}
      </div>
    </Draggable>
  );
};