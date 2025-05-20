import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Checkbox,
  MultiSelect,
  FileInput,
  Button,
  Group,
  Stack,
  Grid,
  Title,
  Text,
} from '@mantine/core';
// import { MapPicker } from './MapPicker'; // You'll need to implement this with Mantine
import { useCreateListingMutation } from ''; // Adjust the import path
import { notifications } from '@mantine/notifications';

const amenitiesOptions = [
  { value: 'parking', label: 'Parking' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'gym', label: 'Gym' },
  { value: 'pool', label: 'Pool' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'tv', label: 'TV' },
];

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
];

export const HouseListingForm = ({ initialData, onSuccess }) => {
  const [createListing, { isLoading }] = useCreateListingMutation();
  const [imageFiles, setImageFiles] = useState([]);

  const form = useForm({
    initialValues: initialData || {
      title: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFootage: 0,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: [0, 0],
      },
      rent: {
        amount: 0,
        frequency: 'monthly',
      },
      amenities: [],
      images: [],
    },

    validate: {
      title: (value) => (value ? null : 'Title is required'),
      bedrooms: (value) => (value > 0 ? null : 'Must have at least 1 bedroom'),
      bathrooms: (value) => (value > 0 ? null : 'Must have at least 1 bathroom'),
      'address.street': (value) => (value ? null : 'Street address is required'),
      'address.city': (value) => (value ? null : 'City is required'),
      'address.state': (value) => (value ? null : 'State is required'),
      'address.zipCode': (value) => (value ? null : 'Zip code is required'),
      'rent.amount': (value) => (value > 0 ? null : 'Rent amount must be positive'),
    },
  });

  const handleMapClick = (lat, lng) => {
    form.setFieldValue('address.coordinates', [lng, lat]);
  };

  const handleImageChange = (files) => {
    setImageFiles(files);
    form.setFieldValue(
      'images',
      files.map((file) => file.name)
    );
  };

  const handleSubmit = async (values: typeof form.values) => {
    const formData = new FormData();
    
    // Append basic fields
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('bedrooms', values.bedrooms.toString());
    formData.append('bathrooms', values.bathrooms.toString());
    formData.append('availableFrom', values.availableFrom.toISOString());
  
    // Append rent object
    formData.append('rent[amount]', values.rent.amount.toString());
    formData.append('rent[currency]', values.rent.currency);
    formData.append('rent[period]', values.rent.period);
  
    // Append address object
    formData.append('address[street]', values.address.street);
    formData.append('address[city]', values.address.city);
    formData.append('address[state]', values.address.state);
    formData.append('address[zipCode]', values.address.zipCode);
  
    // Append rules object
    formData.append('rules[petsAllowed]', values.rules.petsAllowed.toString());
    formData.append('rules[smokingAllowed]', values.rules.smokingAllowed.toString());
    formData.append('rules[maxOccupants]', values.rules.maxOccupants.toString());
  
    // Append amenities array
    values.amenities.forEach(amenity => {
      formData.append('amenities[]', amenity);
    });
  
    // Append images
    files.forEach(file => {
      formData.append('images', file);
    });
  
    try {
      const response = await fetch('/api/list', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to create listing');
      }
  
      const result = await response.json();
    //   router.push(`/listings/${result._id}`);
    } catch (error) {
      console.error('Submission error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create listing',
        color: 'red',
      });
    }
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Title order={3}>Basic Information</Title>
        
        <TextInput
          label="Title"
          placeholder="Modern 2-Bedroom Apartment"
          {...form.getInputProps('title')}
          required
        />
        
        <Textarea
          label="Description"
          placeholder="Spacious apartment with great amenities"
          {...form.getInputProps('description')}
          minRows={4}
        />
        
        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Bedrooms"
              min={1}
              {...form.getInputProps('bedrooms')}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <NumberInput
              label="Bathrooms"
              min={1}
              {...form.getInputProps('bathrooms')}
              required
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <NumberInput
              label="Square Footage"
              min={0}
              {...form.getInputProps('squareFootage')}
            />
          </Grid.Col>
        </Grid>

        <Title order={3} mt="md">Address</Title>
        
        <TextInput
          label="Street"
          placeholder="123 Main St"
          {...form.getInputProps('address.street')}
          required
        />
        
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="City"
              placeholder="New York"
              {...form.getInputProps('address.city')}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="State"
              placeholder="NY"
              {...form.getInputProps('address.state')}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TextInput
              label="Zip Code"
              placeholder="10001"
              {...form.getInputProps('address.zipCode')}
              required
            />
          </Grid.Col>
        </Grid>
        
        <div>
          <Text size="sm" fw={500} mb="xs">
            Location on Map
          </Text>
          {/* <MapPicker */}
            {/* onLocationSelect={handleMapClick}
            initialLocation={form.values.address.coordinates}
          /> */}
          <Text size="xs" color="dimmed" mt="xs">
            Click on the map to set the location
          </Text>
        </div>

        <Title order={3} mt="md">Rent Details</Title>
        
        <Grid>
          <Grid.Col span={8}>
            <NumberInput
              label="Amount"
              min={0}
            //   precision={2}
              step={100}
              {...form.getInputProps('rent.amount')}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Frequency"
              data={frequencyOptions}
              {...form.getInputProps('rent.frequency')}
              required
            />
          </Grid.Col>
        </Grid>

        <Title order={3} mt="md">Amenities</Title>
        
        <MultiSelect
          data={amenitiesOptions}
          placeholder="Select amenities"
          {...form.getInputProps('amenities')}
        />

        <Title order={3} mt="md">Photos</Title>
        
        <FileInput
          label="Upload Images"
          placeholder="Select images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <Title order={3} mt="md">House Rules</Title>
        
        <Checkbox
          label="Pets Allowed"
          {...form.getInputProps('rules.petsAllowed', { type: 'checkbox' })}
        />
        
        <Checkbox
          label="Smoking Allowed"
          {...form.getInputProps('rules.smokingAllowed', { type: 'checkbox' })}
          mt="sm"
        />
        
        <NumberInput
          label="Maximum Occupants"
          min={1}
          {...form.getInputProps('rules.maxOccupants')}
          mt="md"
        />

        <Group justify="right" mt="xl">
          <Button type="submit" loading={isLoading}>
            Save Listing
          </Button>
        </Group>
      </Stack>
    </form>
  );
};