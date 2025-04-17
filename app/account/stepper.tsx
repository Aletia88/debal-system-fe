import { useState } from 'react';
import { Stepper, Button, Group, Flex, Box, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Form() {
  const [active, setActive] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);

  // Form for step 1
  const accountForm = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password too short'),
    },
  });

  // Form for step 2
  const verifyForm = useForm({
    initialValues: { code: '' },
    validate: {
      code: (value) => (value.length === 6 ? null : 'Code must be 6 digits'),
    },
  });

  // Form for step 3
  const profileForm = useForm({
    initialValues: { name: '', company: '' },
    validate: {
      name: (value) => (value.trim() ? null : 'Name is required'),
    },
  });

  const handleStepChange = (nextStep: number) => {
    if (nextStep > 3 || nextStep < 0) return;
    
    // Validate current step before proceeding
    if (nextStep > active) {
      if (active === 0 && !accountForm.isValid()) return;
      if (active === 1 && !verifyForm.isValid()) return;
      if (active === 2 && !profileForm.isValid()) return;
    }

    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

  return (
    <Flex gap="xl" align="flex-start" className='p-5'>
      {/* Vertical stepper on the left */}
      <Box>
        <Stepper active={active} onStepClick={setActive} orientation="vertical" className='pr-5'>
          <Stepper.Step
            label="Create account"
            description="Set up your credentials"
            allowStepSelect={shouldAllowSelectStep(0)}
          />
          <Stepper.Step
            label="Verify email"
            description="Enter verification code"
            allowStepSelect={shouldAllowSelectStep(1)}
          />
          <Stepper.Step
            label="Complete profile"
            description="Tell us about yourself"
            allowStepSelect={shouldAllowSelectStep(2)}
          />
          {/* <Stepper.Completed /> */}
        </Stepper>
      </Box>

      {/* Form content on the right */}
      <Box style={{ flex: 1, minWidth: 400 }} className='border border-t-2 border-t-[#9F12E0] p-5 bg-white'>
        {active === 0 && (
          <form onSubmit={accountForm.onSubmit(() => handleStepChange(1))}>
            <Text size="xl" fw={500} mb="md">Create Account</Text>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              {...accountForm.getInputProps('email')}
              mb="sm"
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              {...accountForm.getInputProps('password')}
              mb="md"
            />
          </form>
        )}

        {active === 1 && (
          <form onSubmit={verifyForm.onSubmit(() => handleStepChange(2))}>
            <Text size="xl" fw={500} mb="md">Verify Email</Text>
            <TextInput
              label="Verification Code"
              placeholder="6-digit code"
              {...verifyForm.getInputProps('code')}
              mb="md"
            />
          </form>
        )}

        {active === 2 && (
          <form onSubmit={profileForm.onSubmit(() => handleStepChange(3))}>
            <Text size="xl" fw={500} mb="md">Complete Profile</Text>
            <TextInput
              label="Full Name"
              placeholder="Your name"
              {...profileForm.getInputProps('name')}
              mb="sm"
            />
            <TextInput
              label="Company (optional)"
              placeholder="Where you work"
              {...profileForm.getInputProps('company')}
              mb="md"
            />
          </form>
        )}

        {active === 3 && (
          <div>
            <Text size="xl" fw={500} mb="md">Registration Complete!</Text>
            <Text mb="md">Thank you for signing up.</Text>
            <Text>Email: {accountForm.values.email}</Text>
            <Text>Name: {profileForm.values.name}</Text>
          </div>
        )}

        <Group justify="flex-end" mt="xl">
          {active > 0 && (
            <Button variant="default" onClick={() => handleStepChange(active - 1)}>
              Back
            </Button>
          )}
          {active < 3 ? (
            <Button onClick={() => handleStepChange(active + 1)}>
              {active === 2 ? 'Complete' : 'Next'}
            </Button>
          ) : (
            <Button onClick={() => alert('Form submitted!')}>Submit</Button>
          )}
        </Group>
      </Box>
    </Flex>
  );
}