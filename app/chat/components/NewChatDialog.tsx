import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUsersQuery } from "@/store/chat";
import { useCreateConversationMutation } from "@/store/chat";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void; // Add this prop
  preselectedUserId?: string | null;
}

export default function NewChatDialog({ 
  open, 
  onOpenChange, 
  onConversationCreated ,
  preselectedUserId
}: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: usersResponse, isLoading: isLoadingUsers } = useGetUsersQuery({});
  const users = usersResponse?.data || [];
  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  useEffect(() => {
    if (preselectedUserId) {
      setSelectedUser(preselectedUserId);
    }
  }, [preselectedUserId]);

  const handleCreateConversation = async () => {
    if (selectedUser) {
      try {
        const result = await createConversation(selectedUser).unwrap();
        onOpenChange(false);
        setSearchQuery("");
        setSelectedUser(null);
        
        if (result.data?._id) {
          // You might want to set the active chat here or let the parent handle it
          onConversationCreated(result.data._id);
        }
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">New Conversation</h3>
          <button
            onClick={() => {
              onOpenChange(false);
              setSearchQuery("");
              setSelectedUser(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto mb-4 border rounded-lg">
          {isLoadingUsers ? (
            <div className="p-4 text-center">Loading users...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user:any) => (
              <div
                key={user._id}
                className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 ${selectedUser === user._id ? 'bg-purple-50' : ''}`}
                onClick={() => setSelectedUser(user._id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {user.name.split(' ').map((n:any) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{user.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {user.isOnline && (
                    <div className="flex items-center mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  )}
                </div>
                {selectedUser === user._id && (
                  <Check className="h-5 w-5 text-purple-600" />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {debouncedSearch ? "No users found" : "Start typing to search users"}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSearchQuery("");
              setSelectedUser(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={!selectedUser || isCreatingConversation}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isCreatingConversation ? "Creating..." : "Start Chat"}
          </Button>
        </div>
      </div>
    </div>
  );
}