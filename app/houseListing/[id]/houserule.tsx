'use client'
import { useGetHouseRuleByIdQuery } from '@/store/houseListing';
import { List, ThemeIcon, LoadingOverlay } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface Rule {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
  }
  
  interface HouseRulesDisplayProps {
    ruleIds: Rule[];
  }

export function HouseRulesDisplay({ ruleIds }: HouseRulesDisplayProps) {
  const [ruleDetails, setRuleDetails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(ruleIds)
  useEffect(() => {
      const fetchRuleDetails = async () => {
          try {
              const details = await Promise.all(
                  ruleIds.map(async (ruleId) => {
                      
                      const { data } = await useGetHouseRuleByIdQuery(ruleId);
            return data;
          })
        );
        setRuleDetails(details.filter(rule => rule !== undefined));
      } catch (error) {
        console.error('Error fetching rule details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ruleIds.length > 0) {
      fetchRuleDetails();
    } else {
      setIsLoading(false);
    }
  }, [ruleIds]);

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">House Rules</h2>
      {ruleIds.length > 0 ? (
        <List spacing="sm" size="sm" center>
          {ruleIds.map((rule) => (
            <List.Item
              key={rule._id}
              icon={
                rule.isActive ? (
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                ) : (
                  <ThemeIcon color="red" size={24} radius="xl">
                    <IconCircleX size="1rem" />
                  </ThemeIcon>
                )
              }
            >
              <div className="font-medium">{rule.name}</div>
              <div className="text-sm text-gray-600">{rule.description}</div>
            </List.Item>
          ))}
        </List>
      ) : (
        <div className="text-gray-500">No house rules specified</div>
      )}
    </div>
  );
}