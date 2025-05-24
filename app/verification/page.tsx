'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Text,
  Group,
  TextInput,
  FileInput,
  Image,
  LoadingOverlay,
  Alert,
  Container,
  Select,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/store/profile';

const VerificationPage = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter()
  const {data: profile} = useGetProfileQuery({})

  // const isVerfied 

  const form = useForm({
    initialValues: {
      idType: '',
      idNumber: '',
      fullName: '',
    },
    validate: {
      idType: (value) => (value ? null : 'ID type is required'),
      idNumber: (value) => (value ? null : 'ID number is required'),
      fullName: (value) => (value ? null : 'Full name is required'),
    },
  });

  const handleFrontImageUpload = (file: File | null) => {
    if (file) {
      setFrontImage(file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      // Handle the case when file is null (e.g., when user clears the selection)
      setFrontImage(null);
      setFrontPreview(null);
    }
  };
  
  const handleBackImageUpload = (file: File | null) => {
    if (file) {
      setBackImage(file);
      setBackPreview(URL.createObjectURL(file));
    } else {
      // Handle the case when file is null
      setBackImage(null);
      setBackPreview(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!frontImage) {
        throw new Error('Front image is required');
      }

      const formData = new FormData();
      formData.append('idType', form.values.idType);
      formData.append('idNumber', form.values.idNumber);
      formData.append('fullName', form.values.fullName);
      formData.append('frontIdImage', frontImage);
      if (backImage) formData.append('backIdImage', backImage);

      await axios.post('https://debal-api.onrender.com/api/verification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess(true);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Verification submission failed'
          : err instanceof Error
            ? err.message
            : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <LoadingOverlay visible={isLoading}  />

        {success ? (
          <Box ta="center">
            <Alert
              icon={<IconCheck size={16} />}
              title="Verification Submitted!"
              color="green"
              mb="md"
            >
              Your ID verification has been successfully submitted. We will review your documents and notify you once verified.
            </Alert>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </Box>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            {/* <TextInput
              label="ID Type"
              placeholder="Passport, Driver's License, etc."
              required
              {...form.getInputProps('idType')}
              mb="md"
            /> */}
            <Title mb='md' order={4}>Verify your Identity</Title>
            <Select

              label="ID Type"
              placeholder='Choose ID type'
              data={[
                { value: 'national-id', label: 'National ID' },
                { value: 'passport', label: 'Passport' },
                { value: 'driver-license', label: 'Driving License' },
              ]}
              {...form.getInputProps('idType')}
              required
              mb='md'
            />

            <TextInput
              label="ID Number"
              placeholder="Enter your ID number"
              required
              {...form.getInputProps('idNumber')}
              mb="md"
            />

            <TextInput
              label="Full Name"
              placeholder="Enter your full name as on ID"
              required
              {...form.getInputProps('fullName')}
              mb="md"
            />

            <FileInput
              label="Front of ID"
              placeholder="Upload front image"
              leftSection={<IconUpload size={14} />}
              accept="image/*"
              required
              onChange={handleFrontImageUpload}
              mb="md"
            />

            {frontPreview && (
              <Box mb="md">
                <Text size="sm" mb="xs">Front Preview:</Text>
                <Image
                  src={frontPreview}
                  alt="Front of ID"
                  height={160}
                  fit="contain"
                  // withPlaceholder
                />
              </Box>
            )}

            <FileInput
              label="Back of ID (Optional)"
              placeholder="Upload back image"
              leftSection={<IconUpload size={14} />}
              accept="image/*"
              onChange={handleBackImageUpload}
              mb="md"
            />

            {backPreview && (
              <Box mb="md">
                <Text size="sm" mb="xs">Back Preview:</Text>
                <Image
                  src={backPreview}
                  alt="Back of ID"
                  height={160}
                  fit="contain"
                  // withPlaceholder
                />
              </Box>
            )}

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
                {error}
              </Alert>
            )}

            <Group justify="right" mt="xl">
              <Button type="submit" leftSection={<IconCheck size={16} />}>
                Submit Verification
              </Button>
            </Group>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default VerificationPage;
