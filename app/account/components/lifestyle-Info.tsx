import { Select, Textarea, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateLifestyleMutation } from '@/store/profile';

interface LifestyleInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function LifestyleInfo({ onNext, onBack, initialData }: LifestyleInfoProps) {
  const [updateLifestyle, { isLoading }] = useUpdateLifestyleMutation();
  const form = useForm({
    initialValues: {
      personality_type: '',
      daily_routine: '',
      sleep_pattern: '',
    },
    validate: {
      personality_type: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        personality_type: initialData.personality_type || '',
        daily_routine: initialData.daily_routine || '',
        sleep_pattern: initialData.sleep_pattern || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateLifestyle(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save lifestyle info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Personality Type"
        data={ ['introvert', 'extrovert', 'ambivert']}
        {...form.getInputProps('personality_type')}
        mb="md"
      />
      
      <Textarea
        label="Daily Routine"
        description="Describe your typical daily routine"
        {...form.getInputProps('daily_routine')}
        mb="md"
      />
      
      <Select
        label="Sleep Pattern"
        data={['early-bird', 'night-owl', 'flexible']}
        {...form.getInputProps('sleep_pattern')}
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