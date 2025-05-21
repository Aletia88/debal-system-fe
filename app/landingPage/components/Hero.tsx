'use client'
import { Container, Title, Text, Button, Box, Stack, Group } from "@mantine/core"
import Link from "next/link"

export default function Hero() {
  return (
    <Box
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/hero-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      <Container size="md">
        <Stack gap="xl" align="center">
          <Title order={1} size="3.5rem" fw={700} style={{ maxWidth: "800px" }}>
            Find Your Perfect Roommate
          </Title>

          <Text size="xl" style={{ maxWidth: "600px" }}>
            connect with like minded people and share your ideal space
          </Text>

          <Group mt="xl">
            <Button
              component={Link}
              href="/get-started"
              size="lg"
              radius="md"
              color="violet"
              style={{ width: "200px" }}
            >
              Get Started
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}
