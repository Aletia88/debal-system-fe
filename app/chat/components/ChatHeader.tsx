import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  onNewChat: () => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function ChatHeader({ onNewChat, toggleSidebar, sidebarOpen }: ChatHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="p-3 border-b flex justify-between items-center bg-purple-50">
      <div className="flex items-center space-x-2">
        <IconArrowLeft onClick={() => router.push('/')} className='cursor-pointer' size={16} />
        <h2 className="font-bold text-lg text-purple-900">Messages</h2>
      </div>
      <Button
        onClick={onNewChat}
        className="bg-purple-600 hover:bg-purple-700 text-white"
        size="sm"
      >
        <Plus size={16} className="mr-1" /> New Chat
      </Button>
    </div>
  );
}