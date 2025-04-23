// src/store/chatStore.ts
import { create } from 'zustand';

interface ChatState {
  chatOpen: boolean;
  minimized: boolean;
  activeChat: number | null;
  sidebarOpen: boolean;
  setActiveChat: (id: number | null) => void;
  setChatOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatOpen: false,
  minimized: false,
  activeChat: null,
  sidebarOpen: true,
  setActiveChat: (id) => set({ activeChat: id }),
  setChatOpen: (open) => set({ chatOpen: open }),
  setMinimized: (minimized) => set({ minimized }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));