'use client'
import { useForm } from '@mantine/form';
// import { useMutation } from '@tanstack/react-query';
import { Button, TextInput, Textarea, NumberInput, Select, Checkbox, MultiSelect,Badge, FileInput, Group, Stack, Paper, Title, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { useCreateListingMutation, useGetHouseRulesQuery } from '@/store/houseListing';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

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
   const { data: houseRules, isLoading: isRulesLoading } = useGetHouseRulesQuery({});
 
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      rent: {
        amount: 0,
        currency: 'BIRR',
        period: 'month',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      house_rules: [] as string[],
       
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
      
  
      // Prepare the payload
      const payload = {

        title: values.title,
        description: values.description,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        // squareFootage: values.squareFootage, // Add this field to your form if needed
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
        house_rules: values.house_rules 
        // house_rules: "682b1ad47bf7700c34fedb43", // Add this field to your form if needed

       
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
      router.push(`/houseListing/${result.listing._id}`);
    } catch (error) {
      console.error('Submission error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create listing',
        color: 'red',
      });
    }
  };
  
  const activeRules = houseRules?.filter((house_rules:any) => house_rules.isActive) || [];
  const rulesOptions = activeRules?.map((house_rules:any) => ({
    value: house_rules._id,
    label: house_rules.name,
  }));
  // Helper function to upload images
 

  return (
    <Paper p="xl" shadow="sm" radius="md" maw={1200} mx="auto" mt={20}>
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
              <DateInput
                label="Available From"
                {...form.getInputProps('availableFrom')}
                required
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
              {/* <Select
                label="Currency"
                data={[
                  { value: 'BIRR', label: 'BIRR' },
                  { value: 'BIRR', label: 'BIRR' },
                ]}
                {...form.getInputProps('rent.currency')}
                required
              /> */}
              {/* <TextInput 
              label='Currency'
              required
              {...form.getInputProps('rent.currency')}
              /> */}
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
          <Title order={4} mb="sm">House Rules</Title>
              {activeRules.length > 0 ? (
                <MultiSelect
                  label="Select applicable rules"
                  placeholder="Choose house rules"
                  data={rulesOptions}
                  {...form.getInputProps('house_rules')}
                  searchable
                  clearable
                />
              ) : (
                <Badge color="yellow" variant="light">No active house rules available</Badge>
              )}

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