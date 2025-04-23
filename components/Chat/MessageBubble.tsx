'use client';

import { Check } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  time: string;
  isCurrentUser: boolean;
  isRead: boolean;
}

export const MessageBubble = ({ text, time, isCurrentUser, isRead }: MessageBubbleProps) => {
  const bubbleClasses = isCurrentUser 
    ? 'bg-orange-50 ml-auto' 
    : 'bg-white';

  return (
    <div className={`p-3 rounded-lg shadow-sm max-w-[80%] ${bubbleClasses}`}>
      <p className="text-sm">{text}</p>
      <div className="text-xs text-right text-gray-500 mt-1 flex items-center justify-end">
        {time} {isRead && <Check size={12} className="ml-1 text-purple-600" />}
      </div>
    </div>
  );
};