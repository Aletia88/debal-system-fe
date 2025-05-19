import { Switch, Select, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdatePetsMutation } from '@/store/profile';

interface PetsInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function PetsInfo({ onNext, onBack, initialData }: PetsInfoProps) {
  const [updatePets, { isLoading }] = useUpdatePetsMutation();
  const form = useForm({
    initialValues: {
      has_pets: false,
      pet_tolerance: '',
    },
    validate: {
      pet_tolerance: (value, values) => 
        !values.has_pets || value ? null : 'This field is required',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        has_pets: initialData.has_pets || false,
        pet_tolerance: initialData.pet_tolerance || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updatePets(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save pet preferences:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Switch
        label="Do you have pets?"
        {...form.getInputProps('has_pets', { type: 'checkbox' })}
        mb="md"
      />
      
      {form.values.has_pets && (
        <Select
          label="Pet Tolerance"
          data={['no-pets', 'cats', 'dogs', 'both']}
          {...form.getInputProps('pet_tolerance')}
          mb="md"
        />
      )}
      
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