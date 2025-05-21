'use client'
import { Container, Title, Text, Grid, Box } from "@mantine/core"

export default function About() {
  return (
    <Box py={80} id="about">
      <Container size="lg">
        <Grid gutter={50} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={2} mb="md" size="2.5rem" fw={700} c="indigo.9">
              About Us
            </Title>

            <Text size="md" style={{ lineHeight: 1.6 }}>
              Nest is a place that connects prospective roommates. It means you get to find the roommate fit for you, it
              could be in terms of budget, lifestyle, character, even same hometown or school or workplace it goes on
              and on. With our chat, video and voice call features you can get to know your prospective roommates better
              so that you can make an informed choice of roommate.
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ position: "relative", height: "400px" }}>
              <Box
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "violet",
                  borderRadius: "50% 50% 0 50%",
                  transform: "rotate(10deg)",
                  zIndex: 1,
                }}
              >
                {/* Stars decoration */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Box
                    key={i}
                    style={{
                      position: "absolute",
                      color: "#ff5252",
                      fontSize: `${20 + i * 5}px`,
                      top: `${i * 15}%`,
                      left: `${i * 10 + 20}%`,
                      transform: "rotate(15deg)",
                    }}
                  >
                    ★
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  )
}
