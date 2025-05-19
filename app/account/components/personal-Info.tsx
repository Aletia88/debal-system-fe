import { TextInput, Select, Radio, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { useUpdatePersonalInfoMutation } from '@/store/profile';

interface PersonalInfoProps {
  onNext: () => void;
  initialData?: any;
}

export default function PersonalInfo({ onNext, initialData }: PersonalInfoProps) {
  const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfoMutation();
  const form = useForm({
    initialValues: {
      age: '',
      gender: '',
      occupation: '',
      religion: '',
      relationship_status: 'single',
    },
    validate: {
      age: (value) => (value && !isNaN(Number(value)) ? null : 'Please enter a valid age'),
      gender: (value) => (value ? null : 'This field is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        age: initialData.age?.toString() || '',
        gender: initialData.gender || '',
        occupation: initialData.occupation || '',
        religion: initialData.religion || '',
        relationship_status: initialData.relationship_status || 'single',
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updatePersonalInfo({
        age: Number(values.age),
        gender: values.gender.toLowerCase(),
        occupation: values.occupation,
        religion: values.religion.toLowerCase(),
        relationship_status: values.relationship_status
      }).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Age"
        type="number"
        {...form.getInputProps('age')}
        mb="md"
      />
      
      <Select
        label="Gender"
        data={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
        {...form.getInputProps('gender')}
        mb="md"
      />
      
      <TextInput
        label="Occupation"
        {...form.getInputProps('occupation')}
        mb="md"
      />
      
      <Select
        label="Religion"
        data={['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Atheism', 'Other']}
        {...form.getInputProps('religion')}
        mb="md"
      />
      
      <Radio.Group
        label="Relationship Status"
        {...form.getInputProps('relationship_status')}
        mb="md"
      >
        <Group mt="xs">
          <Radio value="single" label="Single" />
          <Radio value="in_relationship" label="In a relationship" />
          <Radio value="married" label="Married" />
        </Group>
      </Radio.Group>
      
      <Group justify="right" mt="xl">
        <Button type="submit" loading={isLoading}>
          Next
        </Button>
      </Group>
    </form>
  );
}