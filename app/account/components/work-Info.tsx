import { useUpdateWorkMutation } from '@/store/profile';
import { Button, Group, Select, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';

// interface WorkInfoProps {
//   onSubmit: () => void;
// }
interface WorkInfoProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export default function WorkInfo({ onNext, onBack, initialData }: WorkInfoProps) {
  const [updateWork] = useUpdateWorkMutation()
  const form = useForm({
    initialValues: {
      work_hours: '',
      works_from_home: false,
      chronotype: '',
    },
    validate: {
      work_hours: (value) => (value ? null : 'This field is required'),
    },
  });
  const handleSubmit = async (values: any) => {
    try {
      await updateWork(values).unwrap();
      onNext();
    } catch (error) {
      console.error('Failed to save neighborhood info:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Work Hours"
        data={ ['9-5', 'flexible', 'shift-work', 'other']}
        {...form.getInputProps('work_hours')}
        mb="md"
      />
      
      <Switch
        label="Do you work from home?"
        {...form.getInputProps('works_from_home', { type: 'checkbox' })}
        mb="md"
      />
      
      <Select
        label="Chronotype (Natural sleep preference)"
        data={ ['early-bird', 'night-owl', 'flexible']}
        {...form.getInputProps('chronotype')}
        mb="md"
      />
      
      <Group justify="space-between" mt="xl">
              <Button variant="default" onClick={onBack}>
                Back
              </Button>
              <Button type="submit" >
                Next
              </Button>
            </Group>
    </form>
  );
}