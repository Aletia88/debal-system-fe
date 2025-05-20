'use client'
import { Check } from "lucide-react"
import { Flex } from "@mantine/core"

export default function MessageBubble({ msg, isCurrentUser }: any) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-1 pb-2 pr-20 rounded-lg shadow-sm max-w-[80%] min-w-32 relative ${
          isCurrentUser ? 'bg-blue-100 rounded-tr-none' : 'bg-white rounded-tl-none'
        } ${!msg.isRead && isCurrentUser ? 'border border-blue-200' : ''}`}
      >
        <p className="text-sm pr-2">{msg.content}</p>
        <div className={`text-xs mt-1 pl-2 flex items-center absolute bottom-1 right-2 ${
          isCurrentUser ? 'text-right justify-end text-gray-500' : 'text-left justify-start text-gray-400'
        }`}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isCurrentUser && (
            <Flex wrap='nowrap' className="ml-1">
              <Check size={12} className={msg.isRead ? 'text-blue-500' : 'text-gray-400'} />
              {msg.read && <Check size={12} className="-ml-1 text-blue-500" strokeWidth={3} />}
            </Flex>
          )}
        </div>
      </div>
    </div>
  )
}
