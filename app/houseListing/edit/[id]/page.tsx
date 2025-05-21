'use client'
import { useGetHouseListingQuery, useUpdateListingMutation,useGetHouseRulesQuery } from '@/store/houseListing';
// import { useGetHouseRulesQuery } from '@'; // Add this import
import { useParams, useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Button, TextInput, Textarea, NumberInput, Select, Checkbox, MultiSelect, Group, Stack, LoadingOverlay, Alert, Card, Title, Divider, Flex, Badge, Container } from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconHomeEdit } from '@tabler/icons-react';

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

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
];

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: listing, isLoading, error } = useGetHouseListingQuery(id as string);
  const { data: houseRules, isLoading: isRulesLoading } = useGetHouseRulesQuery({});
  const [updateListing, { isLoading: isUpdating }] = useUpdateListingMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      rent: {
        amount: 0,
        // currency: 'BIRR',
        frequency: 'monthly',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      house_rules: [] as string[], // Changed from object to array of house_rules IDs
      amenities: [] as string[],
      availableFrom: new Date(),
      status: 'available' as 'available' | 'occupied' | 'maintenance',
    },

    validate: {
      title: (value) => (value.length < 5 ? 'Title must be at least 5 characters' : null),
      description: (value) => (value.length < 20 ? 'Description must be at least 20 characters' : null),
      bedrooms: (value) => (value < 1 ? 'Must have at least 1 bedroom' : null),
      bathrooms: (value) => (value < 1 ? 'Must have at least 1 bathroom' : null),
      // rent.amount: (value) => (value <= 0 ? 'Rent amount must be positive' : null),
      status: (value) => (!value ? 'Status is required' : null),
    },
  });

  useEffect(() => {
    if (listing) {
      form.setValues({
        title: listing.title,
        description: listing.description,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        rent: {
          amount: listing.rent.amount,
          // currency: listing.rent.currency || 'BIRR',
          frequency: listing.rent.frequency || 'month',
        },
        address: {
          street: listing.address.street,
          city: listing.address.city,
          state: listing.address.state,
          zipCode: listing.address.zipCode,
        },
        house_rules: listing.house_rules?.map((rule:any) => rule._id) || [], // Extract just the IDs
        amenities: listing.amenities || [],
        availableFrom: new Date(listing.availableFrom),
        status: listing.status || 'available',
      });
    }
  }, [listing]);
  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    try {
      await updateListing({ id: id as string, data: values }).unwrap();
      notifications.show({
        title: 'Success!',
        message: 'Listing updated successfully',
        color: 'teal',
        icon: <IconCheck />,
      });
      router.push(`/houseListing/${id}`);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update listing. Please try again.',
        color: 'red',
        icon: <IconAlertCircle />,
      });
      console.error('Failed to update listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isRulesLoading) return <LoadingOverlay visible overlayProps={{ blur: 2 }} />;
  if (error) return <Alert color="red" title="Error" icon={<IconAlertCircle />}>Failed to load listing</Alert>;
  if (!listing) return <Alert color="red" title="Error" icon={<IconAlertCircle />}>Listing not found</Alert>;

  // Filter active rules and transform for MultiSelect
  const activeRules = houseRules?.filter((house_rules:any) => house_rules.isActive) || [];
  const rulesOptions = activeRules.map((house_rules:any) => ({
    value: house_rules._id,
    label: house_rules.name,
  }));

  return (
    <Container size='lg' mt={20}>
    {/* <div className="max-w-5xl mx-auto p-4 md:p-6"> */}
      <Card withBorder shadow="sm" padding="lg" radius="md">
        <Flex align="center" gap="sm" mb="md">
          <IconHomeEdit size={32} />
          <Title order={2}>Edit Listing</Title>
        </Flex>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} />
          
          <Stack gap="lg">
            {/* Basic Information Section */}
            <Card withBorder padding="lg" radius="md">
              <Title order={3} mb="sm">Basic Information</Title>
              <TextInput
                label="Title"
                placeholder="Enter property title"
                {...form.getInputProps('title')}
                required
              />
              
              <Textarea
                label="Description"
                placeholder="Describe your property in detail"
                {...form.getInputProps('description')}
                minRows={4}
                required
                mt="md"
              />
            </Card>

            {/* Property Details Section */}
            <Card withBorder padding="lg" radius="md">
              <Title order={3} mb="sm">Property Details</Title>
              <Group grow>
                <NumberInput
                  label="Bedrooms"
                  placeholder="Number of bedrooms"
                  {...form.getInputProps('bedrooms')}
                  min={1}
                  required
                />
                <NumberInput
                  label="Bathrooms"
                  placeholder="Number of bathrooms"
                  {...form.getInputProps('bathrooms')}
                  min={1}
                  required
                />
              </Group>

              <Divider my="md" />

              <Title order={4} mb="sm">Rent Information</Title>
              <Group grow>
                <NumberInput
                  label="Amount"
                  placeholder="Rent amount"
                  {...form.getInputProps('rent.amount')}
                  min={0}
                  // precision={2}
                  required
                />
                {/* <Select
                  label="Currency"
                  placeholder="Select currency"
                  data={[
                    { value: 'BIRR', label: 'BIRR' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'GBP', label: 'GBP' },
                  ]}
                  {...form.getInputProps('rent.currency')}
                  required
                /> */}
                <Select
                  label="Period"
                  placeholder="Select frequency"
                  data={[
                    { value: 'month', label: 'Per Month' },
                    { value: 'week', label: 'Per Week' },
                    { value: 'day', label: 'Per Day' },
                  ]}
                  {...form.getInputProps('rent.frequency')}
                  required
                />
              </Group>

              <Divider my="md" />

              <Title order={4} mb="sm">Status</Title>
              <Select
                label="Listing Status"
                placeholder="Select status"
                data={statusOptions}
                {...form.getInputProps('status')}
                required
              />
            </Card>

            {/* Address Section */}
            <Card withBorder padding="lg" radius="md">
              <Title order={3} mb="sm">Address</Title>
              <Group grow>
                <TextInput
                  label="Street"
                  placeholder="Street address"
                  {...form.getInputProps('address.street')}
                  required
                />
                <TextInput
                  label="City"
                  placeholder="City"
                  {...form.getInputProps('address.city')}
                  required
                />
              </Group>
              <Group grow mt="md">
                <TextInput
                  label="State/Province"
                  placeholder="State or province"
                  {...form.getInputProps('address.state')}
                  required
                />
                <TextInput
                  label="ZIP/Postal Code"
                  placeholder="Postal code"
                  {...form.getInputProps('address.zipCode')}
                  required
                />
              </Group>
            </Card>

            {/* Rules & Amenities Section */}
            <Card withBorder padding="lg" radius="md">
              <Title order={3} mb="sm">Rules & Amenities</Title>
              
              <Title order={4} mb="sm">House Rules</Title>
              {activeRules.length > 0 ? (
               <MultiSelect
               label="House Rules"
               placeholder="Select rules"
               data={rulesOptions}
               value={form.values.house_rules}
               onChange={(selectedIds) => form.setFieldValue('house_rules', selectedIds)}
               searchable
               clearable
             />
              ) : (
                <Badge color="yellow" variant="light">No active house rules available</Badge>
              )}

              <Divider my="md" />

              <Title order={4} mb="sm">Amenities</Title>
              <MultiSelect
                label="Select amenities"
                placeholder="Choose available amenities"
                data={amenitiesOptions}
                {...form.getInputProps('amenities')}
                searchable
              />
            </Card>

            {/* Availability Section */}
            <Card withBorder padding="lg" radius="md">
              <Title order={3} mb="sm">Availability</Title>
              <DateInput
                label="Available From"
                placeholder="Select availability date"
                {...form.getInputProps('availableFrom')}
                required
              />
            </Card>

            <Group justify="flex-end" mt="md">
              <Button
                variant="outline"
                onClick={() => router.push(`/houseListing/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                leftSection={<IconCheck size={18} />}
              >
                Update Listing
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    {/* </div> */}
    </Container>
  );
}