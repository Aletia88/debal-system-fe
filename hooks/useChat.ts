import { useState } from 'react';

export const useChat = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleChat = () => setChatOpen(!chatOpen);
  const toggleMinimize = () => setMinimized(!minimized);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return {
    chatOpen,
    minimized,
    activeChat,
    sidebarOpen,
    setActiveChat,
    toggleChat,
    toggleMinimize,
    toggleSidebar,
    setChatOpen,
    setMinimized,
    setSidebarOpen

  };
};