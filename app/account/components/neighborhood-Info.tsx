import { Select, NumberInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateNeighborhoodMutation } from '@/store/profile';

interface NeighborhoodInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function NeighborhoodInfo({ onNext, onBack, initialData }: NeighborhoodInfoProps) {
  const [updateNeighborhood, { isLoading }] = useUpdateNeighborhoodMutation();
  const form = useForm({
    initialValues: {
      preferred_location_type: '',
      commute_tolerance_minutes: 30,
    },
    validate: {
      preferred_location_type: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        preferred_location_type: initialData.preferred_location_type || '',
        commute_tolerance_minutes: initialData.commute_tolerance_minutes || 30,
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateNeighborhood(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save neighborhood info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Preferred Location Type"
        data={['urban', 'suburban', 'rural']}
        {...form.getInputProps('preferred_location_type')}
        mb="md"
      />
      
      <NumberInput
        label="Maximum Commute Tolerance (minutes)"
        min={5}
        max={120}
        {...form.getInputProps('commute_tolerance_minutes')}
        mb="md"
      />
      
      <Group justify="space-between" mt="xl">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" loading={isLoading}>
          Next
        </Button>
      </Group>
    </form>
  );
}