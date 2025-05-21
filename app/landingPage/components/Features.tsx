'use client'
import { Container, Title, Text, SimpleGrid, Paper, Box, ThemeIcon } from "@mantine/core"
import { IconBed, IconMessageChatbot, IconMapPin } from "@tabler/icons-react"

const features = [
  {
    icon: IconBed,
    title: "Filter by Living Preferences",
    description: "Choose your roommate based on sleep habits, rules tolerance, and more",
  },
  {
    icon: IconMessageChatbot,
    title: "Built-in Chat",
    description: "Talk with potential roommates before committing.",
  },
  {
    icon: IconMapPin,
    title: "Location Matching",
    description: "Get recommendations based on your university or neighborhood.",
  },
]

export default function Features() {
  return (
    <Box py={80}>
      <Container size="lg">
        <Title order={2} ta="center" mb={50} size="2.5rem" fw={700} c="indigo.9">
          You Find the Extras too
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {features.map((feature, index) => (
            <Paper
              key={index}
              p="xl"
              radius="md"
              withBorder
              style={{
                backgroundColor: "#f8f9fa",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ThemeIcon size={60} radius="md" color="violet" mb="md">
                <feature.icon size={30} />
              </ThemeIcon>

              <Title order={3} ta="center" mb="xs" size="h4">
                {feature.title}
              </Title>

              <Text ta="center" c="dimmed">
                {feature.description}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}
