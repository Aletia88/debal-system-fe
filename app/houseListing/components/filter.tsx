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
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [radius, setRadius] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: {
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      location?: string;
      radius?: number;
    } = {};
    
    if (minPrice !== undefined) filters.minPrice = minPrice;
    if (maxPrice !== undefined) filters.maxPrice = maxPrice;
    if (bedrooms !== undefined) filters.bedrooms = bedrooms;
    if (currentLocation) {
      filters.location = `${currentLocation.lng},${currentLocation.lat}`;
    }
    if (radius !== undefined) filters.radius = radius;

    onSubmit(filters);
  };

  const handleReset = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setBedrooms(undefined);
    setRadius(5);
    onReset();
  };

  const handleNumberChange = (value: string | number, setter: (value?: number) => void) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      setter(isNaN(num) ? undefined : num);
    } else {
      setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group grow>
          <NumberInput
            label="Min Price"
            value={minPrice}
            onChange={(value) => handleNumberChange(value, setMinPrice)}
            min={0}
            placeholder="Any"
          />
          <NumberInput
            label="Max Price"
            value={maxPrice}
            onChange={(value) => handleNumberChange(value, setMaxPrice)}
            min={minPrice !== undefined ? minPrice : 0}
            placeholder="Any"
          />
        </Group>
        
        <NumberInput
          label="Bedrooms"
          value={bedrooms}
          onChange={(value) => handleNumberChange(value, setBedrooms)}
          min={0}
          placeholder="Any"
        />
        
        {currentLocation && (
          <NumberInput
            label="Radius (km)"
            value={radius}
            onChange={(value) => {
              if (typeof value === 'string') {
                const num = parseInt(value, 10);
                setRadius(isNaN(num) ? 5 : num);
              } else {
                setRadius(value);
              }
            }}
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