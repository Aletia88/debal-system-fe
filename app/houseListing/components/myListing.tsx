'use client'
import { useGetListQuery } from '@/store/houseListing';
import HouseListingCard from './HouseListingCard';
import { Button, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function MyListings() {
  const { data, isLoading } = useGetListQuery({});
  const router = useRouter()

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Group justify='end'>
        <Button onClick={()=>router.push('./houseListing/new')}>Add New</Button>
      </Group>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data?.listings.map((listing: any) => (
        <HouseListingCard key={listing._id} listing={listing} />
      ))}
    </div>
    </>
  );
}