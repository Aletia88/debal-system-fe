import { TextInput, Select, Radio, Group, Button, Textarea } from '@mantine/core';
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
      fullname: '',
      age: '',
      gender: '',
      occupation: '',
      religion: '',
      relationship_status: 'single',
      bio: '',
      phone_number: '',
      social_media_links: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        telegram: ''
      }
    },
    validate: {
      fullname: (value) => (value.trim().length > 0 ? null : 'Full name is required'),
      age: (value) => (value && !isNaN(Number(value)) ? null : 'Please enter a valid age'),
      gender: (value) => (value ? null : 'This field is required'),
      phone_number: (value) => (value.trim().length > 0 ? null : 'Phone number is required'),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValues({
        fullname: initialData.fullname || '',
        age: initialData.age?.toString() || '',
        gender: initialData.gender || '',
        occupation: initialData.occupation || '',
        religion: initialData.religion || '',
        relationship_status: initialData.relationship_status || 'single',
        bio: initialData.bio || '',
        phone_number: initialData.phone_number || '',
        social_media_links: {
          facebook: initialData.social_media_links?.facebook || '',
          instagram: initialData.social_media_links?.instagram || '',
          twitter: initialData.social_media_links?.twitter || '',
          linkedin: initialData.social_media_links?.linkedin || '',
          telegram: initialData.social_media_links?.telegram || ''
        }
      });
    }
  }, [initialData]);

  const handleSubmit = async (values: any) => {
    try {
      await updatePersonalInfo({
        fullname: values.fullname,
        age: Number(values.age),
        gender: values.gender.toLowerCase(),
        occupation: values.occupation,
        religion: values.religion.toLowerCase(),
        relationship_status: values.relationship_status,
        bio: values.bio,
        phone_number: values.phone_number,
        social_media_links: {
          facebook: values.social_media_links.facebook,
          instagram: values.social_media_links.instagram,
          twitter: values.social_media_links.twitter,
          linkedin: values.social_media_links.linkedin,
          telegram: values.social_media_links.telegram
        }
      }).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save personal info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Full Name"
        {...form.getInputProps('fullname')}
        mb="md"
        required
      />
      
      <TextInput
        label="Age"
        type="number"
        {...form.getInputProps('age')}
        mb="md"
        required
      />
      
      <Select
        label="Gender"
        data={['male', 'female']}
        {...form.getInputProps('gender')}
        mb="md"
        required
      />
      
      <TextInput
        label="Occupation"
        {...form.getInputProps('occupation')}
        mb="md"
      />
      
      <Select
        label="Religion"
        data={['christianity', 'islam', 'hinduism', 'judaism', 'other', 'none']}
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
      
      <Textarea
        label="Bio"
        {...form.getInputProps('bio')}
        mb="md"
        autosize
        minRows={3}
        maxRows={6}
      />
      
      <TextInput
        label="Phone Number"
        {...form.getInputProps('phone_number')}
        mb="md"
        required
      />
      
      <TextInput
        label="Facebook URL"
        {...form.getInputProps('social_media_links.facebook')}
        mb="sm"
      />
      
      <TextInput
        label="Instagram URL"
        {...form.getInputProps('social_media_links.instagram')}
        mb="sm"
      />
      
      <TextInput
        label="Twitter URL"
        {...form.getInputProps('social_media_links.twitter')}
        mb="sm"
      />
      
      <TextInput
        label="LinkedIn URL"
        {...form.getInputProps('social_media_links.linkedin')}
        mb="sm"
      />
      
      <TextInput
        label="Telegram Username"
        {...form.getInputProps('social_media_links.telegram')}
        mb="md"
      />
      
      <Group justify="right" mt="xl">
        <Button type="submit" loading={isLoading}>
          Next
        </Button>
      </Group>
    </form>
  );
}