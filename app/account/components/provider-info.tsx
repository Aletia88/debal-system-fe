// components/provider-Info.tsx
import { TextInput, Button, Stack, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProviderInfo({ onNext, initialData }: { onNext: () => void, initialData?: any }) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

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
    setIsSubmitting(true);
    setError('');
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch('https://debal-api.onrender.com/api/providers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(values),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      router.push('/profile')
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
          loading={isSubmitting}
          fullWidth
          mt="md"
        >
          Submit Provider Information
        </Button>
      </Stack>
    </form>
  );
}