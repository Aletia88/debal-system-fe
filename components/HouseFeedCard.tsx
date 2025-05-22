// components/HouseFeedCard.tsx
'use client';

import Image from 'next/image';
import { MapPin, Bed, Bath, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface HouseFeedCardProps {
  house: {
    _id: string;
    title: string;
    description: string;
    address: {
      city: string;
    };
    rent: {
      amount: number;
      currency: string;
    };
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    photos: any[];
  };
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
 const HouseFeedCard = ({ house }: HouseFeedCardProps) => {
  const router = useRouter();
  const firstPhoto = house.photos?.[0]?.url 

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={firstPhoto ? `${baseUrl}${firstPhoto.url}` : "/image.png"}
          alt={house.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{house.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">{house.address.city}</span>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Bed size={14} className="mr-1 text-gray-600" />
            <span className="text-sm">{house.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={14} className="mr-1 text-gray-600" />
            <span className="text-sm">{house.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={14} className="mr-1 text-gray-600" />
            <span className="text-sm">{house.rent.amount} {house.rent.currency}</span>
          </div>
        </div>
        
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => router.push(`/house/${house._id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default HouseFeedCard
