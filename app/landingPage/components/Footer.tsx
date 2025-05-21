'use client'
import { Container, Group, ActionIcon, Text, Title, Stack, Box, Button, SimpleGrid } from "@mantine/core"
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconPhone,
  IconMail,
} from "@tabler/icons-react"
import Link from "next/link"

export default function Footer() {
  return (
    <Box
      component="footer"
      style={{
        backgroundColor: "#f0f2f5",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <Stack gap="md">
            <Button
              component={Link}
              href="/contact"
              variant="filled"
              color="violet"
              radius="xl"
              size="md"
              leftSection={<IconPhone size={18} />}
              style={{ width: "fit-content" }}
            >
              CONTACT US
            </Button>

            <Group align="center" gap="xs">
              <IconPhone size={18} color="violet" />
              <Text>251956565656</Text>
            </Group>

            <Group align="center" gap="xs">
              <IconMail size={18} color="violet" />
              <Text>Debal-mini.app@gmail.com</Text>
            </Group>
          </Stack>

          <Stack gap="md" align="center">
            <Title order={3} size="h4" c="violet">
              Find Your Perfect Match.
            </Title>

            <Text size="lg" fw={600} c="violet">
              Socials
            </Text>

            <Group>
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconBrandTwitter size={22} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconBrandInstagram size={22} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconBrandFacebook size={22} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size="lg">
                <IconBrandLinkedin size={22} />
              </ActionIcon>
            </Group>
          </Stack>

          <Stack gap="md">
            <Title order={3} size="h5" c="violet">
              Support
            </Title>

            <Text>Need help? We're here for you!</Text>
            <Text>Email us at: support@debalapp.com</Text>
            <Text>Response time: Within 24 hours</Text>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
