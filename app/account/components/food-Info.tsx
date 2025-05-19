import { Select, Switch, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateFoodMutation } from '@/store/profile';

interface FoodInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function FoodInfo({ onNext, onBack, initialData }: FoodInfoProps) {
  const [updateFood, { isLoading }] = useUpdateFoodMutation();
  const form = useForm({
    initialValues: {
      cooking_frequency: '',
      diet_type: '',
      shared_groceries: false,
    },
    validate: {
      cooking_frequency: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        cooking_frequency: initialData.cooking_frequency || '',
        diet_type: initialData.diet_type || '',
        shared_groceries: initialData.shared_groceries || false,
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateFood(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save food preferences:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Cooking Frequency"
        data={ ['never', 'sometimes', 'often', 'always']}
        {...form.getInputProps('cooking_frequency')}
        mb="md"
      />
      
      <Select
        label="Diet Type"
        data={ ['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'other']}
        {...form.getInputProps('diet_type')}
        mb="md"
      />
      
      <Switch
        label="Share groceries with roommates?"
        {...form.getInputProps('shared_groceries', { type: 'checkbox' })}
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