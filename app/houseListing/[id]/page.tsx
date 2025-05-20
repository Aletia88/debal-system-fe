'use client'
import { useGetHouseListingQuery } from '@/store/houseListing';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export default function ListingDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data: listing, isLoading, isError } = useGetHouseListingQuery(id as string);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8">Error loading listing</div>;
  if (!listing) return <div className="text-center py-8">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to listings
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Image gallery */}
        <div className="md:w-1/2">
          {/* Main image */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
            {listing.photos?.length > 0 ? (
              <Image
                src={`${baseUrl}${listing.photos[selectedImageIndex].url}`}
                alt={listing.photos[selectedImageIndex].description || 'House listing'}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {listing.photos?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {listing.photos.map((photo:any, index:any) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden ${selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <Image
                    src={`${baseUrl}${photo.url}`}
                    alt={photo.description || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side - House details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-semibold">
              {listing.rent?.amount} {listing.rent?.currency}/{listing.rent?.period}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {listing.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Bedrooms</h3>
              <p className="text-2xl">{listing.bedrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Bathrooms</h3>
              <p className="text-2xl">{listing.bathrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Available From</h3>
              <p>{new Date(listing.availableFrom).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Max Occupants</h3>
              <p>{listing.rules?.maxOccupants}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {listing.amenities?.map((amenity:any, index:any) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">House Rules</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                {listing.rules?.petsAllowed ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                Pets allowed
              </li>
              <li className="flex items-center gap-2">
                {listing.rules?.smokingAllowed ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                Smoking allowed
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p>
              {listing.address?.street}, {listing.address?.city}, {listing.address?.state}{' '}
              {listing.address?.zipCode}
            </p>
            {/* You can add a map component here using the coordinates */}
          </div>
        </div>
      </div>
    </div>
  );
}