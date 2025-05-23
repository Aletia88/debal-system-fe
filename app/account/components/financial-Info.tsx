import { Select, NumberInput, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateFinancialMutation } from '@/store/profile';

interface FinancialInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function FinancialInfo({ onNext, onBack, initialData }: FinancialInfoProps) {
  const [updateFinancial, { isLoading }] = useUpdateFinancialMutation();
  const form = useForm({
    initialValues: {
      income_level: '',
      budget_range: {
        min: 2000,
        max: 3000,
      },
    },
    validate: {
      income_level: (value) => (value ? null : 'This field is required'),
      budget_range: {
        max: (value, values) => 
          value >= values.budget_range.min ? null : 'Max budget must be greater than min',
      },
    },
  });

  const incomeLevels = [
    'Under 30,000',
    '30,000-50,000',
    '50,000-75,000',
    '75,000-100,000',
    '100,000-150,000',
    'Over 150,000'
  ];

  useEffect(() => {
    if (initialData) {
      form.setValues({
        income_level: initialData.income_level || '',
        budget_range: initialData.budget_range || { min: 2000, max: 3000 },
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateFinancial(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save financial info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Income Level"
        data={incomeLevels}
        {...form.getInputProps('income_level')}
        mb="md"
      />
      
      <NumberInput
        label="Minimum Budget"
        min={500}
        max={5000}
        {...form.getInputProps('budget_range.min')}
        mb="sm"
      />
      
      <NumberInput
        label="Maximum Budget"
        min={500}
        max={5000}
        {...form.getInputProps('budget_range.max')}
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