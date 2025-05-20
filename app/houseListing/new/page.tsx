'use client'
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Button, TextInput, Textarea, NumberInput, Select, Checkbox, MultiSelect, FileInput, Group, Stack, Paper, Title, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { useCreateListingMutation } from '@/store/houseListing';
import { useState } from 'react';

const amenitiesOptions = [
  'WiFi',
  'Air Conditioning',
  'Heating',
  'Kitchen',
  'Washer',
  'Dryer',
  'Parking',
  'Pool',
  'Gym',
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;

export default function CreateListingPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [createListing, { isLoading }] = useCreateListingMutation();
  const token = localStorage.getItem("token");
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      rent: {
        amount: 0,
        currency: 'USD',
        period: 'month',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      rules: {
        petsAllowed: false,
        smokingAllowed: false,
        maxOccupants: 1,
      },
      amenities: [] as string[],
      availableFrom: new Date(),
    },

    validate: {
      title: (value) => (value.length < 5 ? 'Title must be at least 5 characters' : null),
      description: (value) => (value.length < 20 ? 'Description must be at least 20 characters' : null),
      bedrooms: (value) => (value < 1 ? 'Must have at least 1 bedroom' : null),
      bathrooms: (value) => (value < 1 ? 'Must have at least 1 bathroom' : null),

    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      // First upload images if any
      const uploadedImageUrls = files.length > 0 
        ? await uploadImages(files) 
        : [];
  
      // Prepare the payload
      const payload = {

        title: values.title,
        description: values.description,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        squareFootage: values.squareFootage, // Add this field to your form if needed
        address: {
          street: values.address.street,
          city: values.address.city,
          state: values.address.state,
          zipCode: values.address.zipCode,
          coordinates: [0, 0] // You'll need to add geocoding or get these from your form
        },
        rent: {
          amount: values.rent.amount,
          frequency: values.rent.period === 'month' ? 'monthly' : 
                    values.rent.period === 'week' ? 'weekly' : 'daily'
        },
        amenities: values.amenities,
        availableFrom: values.availableFrom.toISOString().split('T')[0], // YYYY-MM-DD format
        rules: {
          noSmoking: !values.rules.smokingAllowed, // Note the inversion here
          noPets: !values.rules.petsAllowed        // Note the inversion here
        },
        house_rules: "682b1ad47bf7700c34fedb43", // Add this field to your form if needed

        photos: uploadedImageUrls,
        images: uploadedImageUrls // Duplicate if needed or remove one
      };
  
      // Send the JSON payload
      const response = await fetch(`${baseUrl}api/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create listing');
      }
  
      const result = await response.json();
      router.push(`/listings/${result._id}`);
    } catch (error) {
      console.error('Submission error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create listing',
        color: 'red',
      });
    }
  };
  
  // Helper function to upload images
  async function uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    
    // Implement your actual image upload logic here
    // This is just a mock implementation
    for (const file of files) {
      // In a real app, you would upload to S3, Cloudinary, etc.
      // and get back a URL
      uploadedUrls.push(`https://example.com/uploads/${file.name}`);
    }
    
    return uploadedUrls;
  }

  return (
    <Paper p="xl" shadow="sm" radius="md" maw={1200} mx="auto">
      <Title order={1} mb="xl">Create New Listing</Title>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          {/* Basic Information */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Basic Information</Title>
            <TextInput
              label="Title"
              placeholder="Bright Studio Apartment"
              {...form.getInputProps('title')}
              required
            />
            <Textarea
              label="Description"
              placeholder="Describe your property..."
              mt="md"
              minRows={4}
              {...form.getInputProps('description')}
              required
            />
          </Paper>

          {/* Property Details */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Property Details</Title>
            <Group grow>
              <NumberInput
                label="Bedrooms"
                min={1}
                {...form.getInputProps('bedrooms')}
                required
              />
              <NumberInput
                label="Bathrooms"
                min={1}
                {...form.getInputProps('bathrooms')}
                required
              />
              <DatePicker
                label="Available From"
                {...form.getInputProps('availableFrom')}
                // required
              />
            </Group>
          </Paper>

          {/* Rent Information */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Rent Information</Title>
            <Group grow>
              <NumberInput
                label="Amount"
                min={0}
                // precision={2}
                step={50}
                {...form.getInputProps('rent.amount')}
                required
              />
              <Select
                label="Currency"
                data={[
                  { value: 'USD', label: 'USD' },
                  { value: 'EUR', label: 'EUR' },
                  { value: 'GBP', label: 'GBP' },
                ]}
                {...form.getInputProps('rent.currency')}
                required
              />
              <Select
                label="Period"
                data={[
                  { value: 'month', label: 'Per Month' },
                  { value: 'week', label: 'Per Week' },
                  { value: 'day', label: 'Per Day' },
                ]}
                {...form.getInputProps('rent.period')}
                required
              />
            </Group>
          </Paper>

          {/* Address */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Address</Title>
            <Group grow>
              <TextInput
                label="Street"
                {...form.getInputProps('address.street')}
                required
              />
              <TextInput
                label="City"
                {...form.getInputProps('address.city')}
                required
              />
            </Group>
            <Group grow mt="md">
              <TextInput
                label="State/Province"
                {...form.getInputProps('address.state')}
                required
              />
              <TextInput
                label="ZIP/Postal Code"
                {...form.getInputProps('address.zipCode')}
                required
              />
            </Group>
          </Paper>

          {/* House Rules */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">House Rules</Title>
            <Group grow>
              <Checkbox
                label="Pets Allowed"
                {...form.getInputProps('rules.petsAllowed', { type: 'checkbox' })}
              />
              <Checkbox
                label="Smoking Allowed"
                {...form.getInputProps('rules.smokingAllowed', { type: 'checkbox' })}
              />
              <NumberInput
                label="Max Occupants"
                min={1}
                {...form.getInputProps('rules.maxOccupants')}
                required
              />
            </Group>
          </Paper>

          {/* Amenities */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Amenities</Title>
            <MultiSelect
              data={amenitiesOptions}
              placeholder="Select amenities"
              {...form.getInputProps('amenities')}
              clearable
              searchable
            />
          </Paper>

          {/* Images */}
          <Paper p="md" withBorder>
            <Title order={2} mb="md">Images</Title>
            <FileInput
              label="Upload Images"
              multiple
              accept="image/*"
              value={files}
              onChange={setFiles}
              clearable
            />
            {files.length > 0 && (
              <Text size="sm" mt="xs">
                {files.length} {files.length === 1 ? 'file' : 'files'} selected
              </Text>
            )}
          </Paper>

          <Group justify="right" mt="md">
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
            >
              Create Listing
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}