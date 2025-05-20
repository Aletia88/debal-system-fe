'use client'
import { useState } from 'react';
import { NumberInput, Button, Group, Stack } from '@mantine/core';

interface FilterProps {
  onSubmit: (filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    location?: string;
    radius?: number;
  }) => void;
  currentLocation?: { lat: number; lng: number };
  onReset: () => void;
}

export default function Filter({ onSubmit, currentLocation, onReset }: FilterProps) {
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>('');
  const [radius, setRadius] = useState<number | ''>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: Record<string, any> = {};
    
    if (minPrice !== '') filters.minPrice = minPrice;
    if (maxPrice !== '') filters.maxPrice = maxPrice;
    if (bedrooms !== '') filters.bedrooms = bedrooms;
    if (currentLocation) {
      filters.location = `${currentLocation.lng},${currentLocation.lat}`;
    }
    if (radius !== '') filters.radius = radius;

    onSubmit(filters);
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setRadius(5);
    onReset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group grow>
          <NumberInput
            label="Min Price"
            value={minPrice}
            onChange={setMinPrice}
            min={0}
            placeholder="Any"
          />
          <NumberInput
            label="Max Price"
            value={maxPrice}
            onChange={setMaxPrice}
            min={minPrice !== '' ? minPrice : 0}
            placeholder="Any"
          />
        </Group>
        
        <NumberInput
          label="Bedrooms"
          value={bedrooms}
          onChange={setBedrooms}
          min={0}
          placeholder="Any"
        />
        
        {currentLocation && (
          <NumberInput
            label="Radius (km)"
            value={radius}
            onChange={setRadius}
            min={1}
            max={100}
          />
        )}
        
        <Group grow>
          <Button type="submit" color="blue">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </Group>
      </Stack>
    </form>
  );
}