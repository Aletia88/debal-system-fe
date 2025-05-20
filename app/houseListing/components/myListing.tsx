'use client'
import { useGetListQuery } from '@/store/houseListing';
import HouseListingCard from './HouseListingCard';

export default function MyListings() {
  const { data, isLoading } = useGetListQuery({});

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data?.listings.map((listing: any) => (
        <HouseListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
}