'use client'
import { MessageList, MessageInput, Message } from "@chatscope/chat-ui-kit-react";

export default function ChatUI() {
  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MessageList>
        <Message model={{ message: "Hello!", sender: "user" }} />
      </MessageList>
      <MessageInput placeholder="Type message here" />
    </div>
  );
}