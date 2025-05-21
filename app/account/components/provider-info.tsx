// components/provider-Info.tsx
'use client'
import { TextInput, Button, Stack, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Assuming you have or will create this hook
import { useRegisterProviderMutation } from '@/store/profile';

export default function ProviderInfo({ onNext, initialData }: { onNext: () => void, initialData?: any }) {
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Using the mutation hook
  const [registerProvider] = useRegisterProviderMutation();

  const form = useForm({
    initialValues: {
      companyName: initialData?.companyName || '',
      licenseNumber: initialData?.licenseNumber || '',
      contactPhone: initialData?.contactPhone || '',
    },
    validate: {
      companyName: (value) => value.trim().length < 2 ? 'Company name is required' : null,
      licenseNumber: (value) => value.trim().length < 2 ? 'License number is required' : null,
      contactPhone: (value) => value.trim().length < 6 ? 'Valid phone number is required' : null,
    },
  });
  
  const handleSubmit = async (values: any) => {
    try {
      await registerProvider(values).unwrap();
      router.push('/profile');
    } catch (error) {
      console.error('Failed to save shared living preferences:', error);
    }
  };

 

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {error && (
          <Notification color="red" onClose={() => setError('')}>
            {error}
          </Notification>
        )}

        <TextInput
          label="Company Name"
          placeholder="Your company name"
          {...form.getInputProps('companyName')}
          required
        />

        <TextInput
          label="License Number"
          placeholder="Your business license number"
          {...form.getInputProps('licenseNumber')}
          required
        />

        <TextInput
          label="Contact Phone"
          placeholder="Your business phone number"
          {...form.getInputProps('contactPhone')}
          required
        />

        <Button
          type="submit"
          // loading={registerProviderMutation.isPending}
          fullWidth
          mt="md"
        >
          Submit Provider Information
        </Button>
      </Stack>
    </form>
  );
}