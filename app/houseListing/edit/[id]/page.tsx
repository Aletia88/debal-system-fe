'use client'
import { useGetHouseListingQuery, useUpdateListingMutation } from '@/store/houseListing';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Select, Checkbox, MultiSelect, Group, Stack } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useEffect } from 'react';

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

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: listing, isLoading } = useGetHouseListingQuery(id as string);
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();

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
      // Add other fields as needed
    },

    // Simple validation (optional)
    validate: {
      title: (value) => (value.length < 5 ? 'Title must be at least 5 characters' : null),
      description: (value) => (value.length < 20 ? 'Description must be at least 20 characters' : null),
      bedrooms: (value) => (value < 1 ? 'Must have at least 1 bedroom' : null),
      bathrooms: (value) => (value < 1 ? 'Must have at least 1 bathroom' : null),
    //   'rent.amount': (value) => (value <= 0 ? 'Rent amount must be positive' : null),
    },
  });

  // Set form values when listing data is loaded
  useEffect(() => {
    if (listing) {
      form.setValues({
        title: listing.title,
        description: listing.description,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        rent: {
          amount: listing.rent.amount,
          currency: listing.rent.currency,
          period: listing.rent.period,
        },
        address: {
          street: listing.address.street,
          city: listing.address.city,
          state: listing.address.state,
          zipCode: listing.address.zipCode,
        },
        rules: {
          petsAllowed: listing.rules.petsAllowed,
          smokingAllowed: listing.rules.smokingAllowed,
          maxOccupants: listing.rules.maxOccupants,
        },
        amenities: listing.amenities,
        availableFrom: new Date(listing.availableFrom),
      });
    }
  }, [listing]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await updateListing({ id: id as string, data: values }).unwrap();
      router.push(`/houseListing/${id}`);
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          {/* Basic Information */}
          <TextInput
            label="Title"
            {...form.getInputProps('title')}
            required
          />
          
          <Textarea
            label="Description"
            {...form.getInputProps('description')}
            minRows={4}
            required
          />

          {/* Property Details */}
          <Group grow>
            <NumberInput
              label="Bedrooms"
              {...form.getInputProps('bedrooms')}
              min={1}
              required
            />
            <NumberInput
              label="Bathrooms"
              {...form.getInputProps('bathrooms')}
              min={1}
              required
            />
          </Group>

          {/* Rent Information */}
          <Group grow>
            <NumberInput
              label="Amount"
              {...form.getInputProps('rent.amount')}
              min={0}
            //   precision={2}
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

          {/* Address */}
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
          <Group grow>
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

          {/* House Rules */}
          <Group>
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
              {...form.getInputProps('rules.maxOccupants')}
              min={1}
              required
            />
          </Group>

          {/* Amenities */}
          <MultiSelect
            label="Amenities"
            data={amenitiesOptions}
            {...form.getInputProps('amenities')}
          />

          {/* Available From */}
          <DatePicker
            label="Available From"
            {...form.getInputProps('availableFrom')}
            // required
          />

          <Group justify="right" mt="md">
            <Button
              type="submit"
              loading={isUpdating}
            >
              Update Listing
            </Button>
          </Group>
        </Stack>
      </form>
    </div>
  );
}