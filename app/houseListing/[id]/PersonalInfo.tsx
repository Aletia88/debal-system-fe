import { MessageCircle, User, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProviderInfo({ listing, onStartChat }:any) {
  const router = useRouter();
  const socialMedia = listing?.user?.profile?.social_media_links || {};

  const handleStartChat = () => {
    // Navigate to chat page with user ID as query parameter
    router.push(`/chat?newChat=${listing.user_id}`);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <User className="text-purple-600" size={20} />
        Provider Information
      </h2>
      
      <div className="space-y-3">
        {/* Basic Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg font-medium text-gray-600">
              {listing?.user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{listing?.user?.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Phone size={16} />
              <span>{listing?.user?.profile?.phone_number}</span>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {Object.values(socialMedia).some(Boolean) && (
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Social Media</h4>
            <div className="flex gap-2">
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Facebook size={16} className="text-blue-600" />
                  </Button>
                </a>
              )}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Instagram size={16} className="text-pink-600" />
                  </Button>
                </a>
              )}
              {socialMedia.twitter && (
                <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Twitter size={16} className="text-blue-400" />
                  </Button>
                </a>
              )}
              {socialMedia.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <Linkedin size={16} className="text-blue-700" />
                  </Button>
                </a>
                )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Button 
            onClick={handleStartChat}
            className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <MessageCircle size={16} />
            Chat
          </Button>
          <Button 
            onClick={() => router.push(`/profile/${listing.user_id}`)}
            variant="outline" 
            className="flex-1 gap-2"
          >
            <User size={16} />
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
}