'use client'
import React, { useState } from 'react';

import {
  Box,
  Button,
  Card,
  Text,
  Group,
  Badge,
  Switch,
  Modal,
  TextInput,
  Textarea,
  Grid,
  ActionIcon,
  LoadingOverlay,
  SimpleGrid,
  Container,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { useCreateRulesMutation, useGetHouseRulesQuery, useUpdateRuleMutation } from '@/store/houseListing';

const HouseRulesPage = () => {
  // Fetch house rules
  const { data: rules, isLoading, isError, refetch } = useGetHouseRulesQuery({});
  const [createRule] = useCreateRulesMutation();
  const [updateRule] = useUpdateRuleMutation();

  // Modal state
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRule(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for creating new rule
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentRule({
      name: '',
      description: '',
      isActive: true,
    });
    open();
  };

  // Open modal for editing rule
  const handleOpenEditModal = (rule) => {
    setIsEditing(true);
    setCurrentRule({
      _id: rule._id,
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
    });
    open();
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateRule({
          id: currentRule._id,
          data: {
            name: currentRule.name,
            description: currentRule.description,
            isActive: currentRule.isActive,
          },
        }).unwrap();
      } else {
        await createRule({
          name: currentRule.name,
          description: currentRule.description,
          isActive: currentRule.isActive,
        }).unwrap();
      }
      refetch();
      close();
    } catch (error) {
      console.error('Failed to save rule:', error);
    }
  };

  // Toggle rule active status manually
  const handleToggleStatus = async (ruleId, currentStatus) => {
    try {
      await updateRule({
        id: ruleId,
        data: { isActive: !currentStatus },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  if (isLoading) return <LoadingOverlay visible={true} />;
  if (isError) return <Text color="red">Error loading house rules</Text>;

  return (
    <Container size='xl' p="md">
      <Group justify="apart" mb="md">
        <Text size="xl" fw={700}>House Rules</Text>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleOpenCreateModal}
        >
          Add New Rule
        </Button>
      </Group>

      <SimpleGrid cols={{base:1, sm:2,md:3}}>
        {rules?.map((rule:any) => (
        //   <Grid.Col key={rule._id} sm={6} md={4}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="apart" mb="xs">
                <Text fw={500}>{rule.name}</Text>
                <Badge color={rule.isActive ? 'green' : 'gray'}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Group>

              <Text size="sm" color="dimmed" mb="md">
                {rule.description}
              </Text>

              <Group justify="apart">
                <Group gap="xs">
                  <Switch
                    checked={rule.isActive}
                    onChange={() => handleToggleStatus(rule._id, rule.isActive)}
                    label={rule.isActive ? 'Disable' : 'Enable'}
                  />
                </Group>
                <ActionIcon
                  color="blue"
                  onClick={() => handleOpenEditModal(rule)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Group>
            </Card>
        //   </Grid.Col>
        ))}
      </SimpleGrid>

      {/* Create/Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={isEditing ? 'Edit House Rule' : 'Create New House Rule'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Rule Name"
            name="name"
            value={currentRule.name}
            onChange={handleInputChange}
            required
            mb="md"
          />

          <Textarea
            label="Description"
            name="description"
            value={currentRule.description}
            onChange={handleInputChange}
            required
            minRows={4}
            mb="md"
          />

          {!isEditing && (
            <Switch
              label="Active"
              checked={currentRule.isActive}
              onChange={(e) => setCurrentRule(prev => ({
                ...prev,
                isActive: e.currentTarget.checked,
              }))}
              mb="md"
            />
          )}

          <Group justify="right">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" color="blue">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default HouseRulesPage;