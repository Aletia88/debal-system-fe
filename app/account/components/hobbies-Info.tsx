import { MultiSelect, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateHobbiesMutation } from '@/store/profile';

interface HobbiesInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function HobbiesInfo({ onNext, onBack, initialData }: HobbiesInfoProps) {
  const [updateHobbies, { isLoading }] = useUpdateHobbiesMutation();
  const form = useForm({
    initialValues: {
      hobbies: [],
    },
    validate: {
      hobbies: (value) => (value.length > 0 ? null : 'Select at least one hobby'),
    },
  });

  const hobbiesData =  ['reading', 'sports', 'travelling', 'music', 'movies', 'gaming', 'cooking', 'art','board games'];

  useEffect(() => {
    if (initialData) {
      form.setValues({
        hobbies: initialData || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateHobbies(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save hobbies:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <MultiSelect
        label="Hobbies"
        data={hobbiesData}
        {...form.getInputProps('hobbies')}
        mb="md"
        searchable
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