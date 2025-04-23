'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const MessageInput = () => {
  return (
    <div className="p-4 border-t">
      <div className="relative">
        <Input placeholder="Type your message here..." className="pr-12 rounded-full" />
        <Button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600">
          <Send size={16} className="text-white" />
        </Button>
      </div>
    </div>
  );
};