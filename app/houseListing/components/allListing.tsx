'use client'
import { useState } from 'react';
import { useGetFilteredListingsQuery } from '@/store/houseListing';
import HouseListingCard from './HouseListingCard';
import Filter from './filter';
import { Box, Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function AllListings() {
  const [opened, { open, close }] = useDisclosure(false);
  const [filters, setFilters] = useState<Partial<{
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    location: string;
    radius: number;
  }>>({});

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data, isLoading, isError } = useGetFilteredListingsQuery(filters);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentLocation(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading listings</div>;

  return (
    <Box className=''>
      <Button onClick={open} mb="md">
        Filter Listings
      </Button>

      {!currentLocation && (
        <Button onClick={handleGetLocation} ml="md" variant="outline">
          Use My Location
        </Button>
      )}

      <Drawer opened={opened} onClose={close} title="Filter Listings">
        <Filter 
          onSubmit={(newFilters) => {
            setFilters(newFilters);
            close();
          }} 
          currentLocation={currentLocation || undefined}
          onReset={handleResetFilters}
        />
      </Drawer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {data?.map((listing: any) => (
          <HouseListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </Box>
  );
}