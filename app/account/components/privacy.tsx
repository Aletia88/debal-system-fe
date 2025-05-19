import { Select, Radio, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdatePrivacyMutation } from '@/store/profile';

interface PrivacyInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function PrivacyInfo({ onNext, onBack, initialData }: PrivacyInfoProps) {
  const [updatePrivacy, { isLoading }] = useUpdatePrivacyMutation();
  const form = useForm({
    initialValues: {
      privacy_level: '',
      chore_sharing_preference: 'separate',
      shared_space_usage: 'average',
      guest_frequency: 'rarely',
      party_habits: 'rarely',
    },
    validate: {
      privacy_level: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        privacy_level: initialData.privacy_level || '',
        chore_sharing_preference: initialData.chore_sharing_preference || 'separate',
        shared_space_usage: initialData.shared_space_usage || 'average',
        guest_frequency: initialData.guest_frequency || 'rarely',
        party_habits: initialData.party_habits || 'rarely',
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updatePrivacy(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save shared living preferences:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Privacy Level"
        data={  ['high', 'medium', 'low']}
        {...form.getInputProps('privacy_level')}
        mb="md"
      />
      
      
      
      
      <Select
        label="Shared Space Usage"
        data={ ['private', 'shared', 'both']}
        {...form.getInputProps('shared_space_usage')}
        mb="md"
      />
      
     
      
      <Group justify="space-between" mt="xl">
       
        <Button type="submit" loading={isLoading}>
          Next
        </Button>
      </Group>
    </form>
  );
}