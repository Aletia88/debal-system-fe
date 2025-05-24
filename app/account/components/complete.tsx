import { Button, Group, Card, Text, Title, Center } from '@mantine/core';
import { useMarkCompleteMutation } from '@/store/profile';
import { useRouter } from 'next/navigation';

interface CompleteMessageProps {
  onBack: () => void;
}

export default function CompleteMessage({ onBack }: CompleteMessageProps) {
  const [markComplete, { isLoading, isSuccess, isError }] = useMarkCompleteMutation();
  const router = useRouter()

  const handleComplete = async () => {
    try {
      await markComplete({}).unwrap();
    } catch (error) {
      console.error('Failed to mark profile as complete:', error);
    }
  };

  return (
    <Center mih="60vh">
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 500 }}>
        <Title order={2} mb="md" ta="center">
          Profile Completion
        </Title>
        
        {isSuccess ? (
          <>
            <Text mb="xl" ta="center">
              🎉 Your profile has been successfully completed and submitted!
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              You can now browse potential roommates or update your profile later.
            </Text>
          </>
        ) : isError ? (
          <Text mb="xl" c="red" ta="center">
            Failed to complete profile. Please try again.
          </Text>
        ) : (
          <>
            <Text mb="xl" ta="center">
              You've completed all profile sections! Click the button below to finalize your profile.
            </Text>
            <Text size="sm" c="dimmed" ta="center" mb="xl">
              After completion, your profile will be visible to potential matches.
            </Text>
          </>
        )}

        <Group justify="center" mt="xl">
          {!isSuccess && (
            <>
              <Button variant="default" onClick={onBack}>
                Back
              </Button>
              <Button 
                onClick={handleComplete} 
                loading={isLoading}
                disabled={isSuccess}
              >
                {isSuccess ? 'Completed!' : 'Complete Profile'}
              </Button>
            </>
          )}
          {isSuccess && (
            <Button component="a" href="/">
              Go to Home
            </Button>
          )}
        </Group>
      </Card>
    </Center>
  );
}