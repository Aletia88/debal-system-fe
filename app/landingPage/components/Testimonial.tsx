'use client'
import { Container, Text, Box, Paper } from "@mantine/core"

export default function Testimonial() {
  return (
    <Box py={80}>
      <Container size="md">
        <Paper
          p="xl"
          radius="md"
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Text size="xl" fw={600} fs="italic" mb="md">
            "I found my best friend through Debal. We've been roommates ever since!"
          </Text>
        </Paper>
      </Container>
    </Box>
  )
}
