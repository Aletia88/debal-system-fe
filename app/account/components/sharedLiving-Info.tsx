import { Select, Radio, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdateSharedLivingMutation } from '@/store/profile';

interface SharedLivingInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function SharedLivingInfo({ onNext, onBack, initialData }: SharedLivingInfoProps) {
  const [updateSharedLiving, { isLoading }] = useUpdateSharedLivingMutation();
  const form = useForm({
    initialValues: {
      cleanliness_level: '',
      chore_sharing_preference: 'separate',
      noise_tolerance: 'average',
      guest_frequency: 'rarely',
      party_habits: 'rarely',
    },
    validate: {
      cleanliness_level: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        cleanliness_level: initialData.cleanliness_level || '',
        chore_sharing_preference: initialData.chore_sharing_preference || 'separate',
        noise_tolerance: initialData.noise_tolerance || 'average',
        guest_frequency: initialData.guest_frequency || 'rarely',
        party_habits: initialData.party_habits || 'rarely',
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updateSharedLiving(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save shared living preferences:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Cleanliness Level"
        data={ ['very-clean', 'clean', 'average', 'messy']}
        {...form.getInputProps('cleanliness_level')}
        mb="md"
      />
      
      <Radio.Group
        label="Chore Sharing Preference"
        {...form.getInputProps('chore_sharing_preference')}
        mb="md"
      >
        <Group mt="xs">
          <Radio value="share" label="Shared equally" />
          <Radio value="separate" label="Separate responsibilities" />
          <Radio value="flexible" label="Flexible" />
        </Group>
      </Radio.Group>
      
      <Select
        label="Noise Tolerance"
        data={ ['quiet', 'average', 'noisy']}
        {...form.getInputProps('noise_tolerance')}
        mb="md"
      />
      
      <Select
        label="Guest Frequency"
        data={ ['never', 'rarely', 'sometimes', 'often']}
        {...form.getInputProps('guest_frequency')}
        mb="md"
      />
      
      <Select
        label="Party Habits"
        data={ ['never', 'rarely', 'sometimes', 'often']}
        {...form.getInputProps('party_habits')}
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