'use client'

import { useEffect } from 'react';
import { useSocket } from '@/context/socketContext';
import { useGetProfileQuery } from '@/store/profile';

export const useChatSocket = (conversationId: string | null) => {
  const { socket } = useSocket();
  const { data: currentUser } = useGetProfileQuery({});

  // Send message handler
  const sendMessage = (content: string) => {
    if (!socket || !conversationId || !currentUser) return;

    socket.emit('sendMessage', {
      conversationId,
      content,
      senderId: currentUser.user._id,
    });
  };

  // Join conversation room
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('joinConversation', conversationId);

    return () => {
      socket.emit('leaveConversation', conversationId);
    };
  }, [socket, conversationId]);

  return { sendMessage };
};