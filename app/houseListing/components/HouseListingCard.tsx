'use client'
import Link from 'next/link';
import Image from 'next/image';
import { Text } from '@mantine/core';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;

interface HouseListingCardProps {
  listing: {
    _id: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    rent: {
      amount: number;
      currency: string;
    };
    amenities: string[];
    availableFrom: string;
    photos: Array<{
      url: string;
      description?: string;
    }>;
  };
}

export default function HouseListingCard({ listing }: HouseListingCardProps) {
  return (
    <div className="border bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      {listing.photos && listing.photos.length > 0 ? (
        <div className="relative h-48 w-full">
          <Image
            src={`${listing.photos[0].url}`}
            alt={listing.photos[0].description || 'House listing'}
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Text size="xl" fw={600} lineClamp={1} className="w-[70%]">
            {listing.title}
          </Text>
          <span className="text-sm font-semibold">
            {listing.rent.amount} BIRR
          </span>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-2">{listing.description}</p>
        
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.amenities.map((amenity, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <span className="text-sm">
            Available from: {new Date(listing.availableFrom).toLocaleDateString()}
          </span>
        </div>
        
        <Link 
          href={`/houseListing/${listing._id}`}
          className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}