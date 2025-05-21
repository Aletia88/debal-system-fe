'use client'
import { Anchor, Button, Checkbox, Divider, Group, Image, Paper, PasswordInput, Stack, Text, TextInput, Title, rem, Notification, Select } from "@mantine/core";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle, IconX } from "@tabler/icons-react";
import { loginSuccess, loginFailure } from "@/store/authSlice";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: 'user'
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? "Name must be at least 2 characters" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (
        value.length < 6 ? "Password must be at least 6 characters" :
          !/[A-Z]/.test(value) ? "Password must contain at least one uppercase letter" :
            !/[a-z]/.test(value) ? "Password must contain at least one lowercase letter" :
              !/[0-9]/.test(value) ? "Password must contain at least one number" :
                null
      ),
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setShowError(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(
          loginSuccess({
            token: data.token,
            refreshToken: data.refresh,
            user: data.user,
          })
        );
        router.push("/verification");
      } else {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.detail || "Registration failed");
          setShowError(true);
        } catch (err) {
          setError("Registration failed");
          setShowError(true);
        }
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: rem(32) }}>
        <div style={{ width: '100%', maxWidth: rem(1200), margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: rem(32),
            alignItems: 'center'
          }}>
            <div style={{
              position: 'relative',
              height: '70vh',
              minHeight: rem(400),
              borderRadius: 'var(--mantine-radius-lg)',
              overflow: 'hidden'
            }}>
              <Image
                src="/room.png"
                alt="People socializing"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center center', // This ensures the center of the image is shown
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>

            <Paper withBorder shadow="sm" p={30} radius="md" style={{ maxWidth: rem(500) }}>
              {showError && (
                <Notification
                  icon={<IconX size="1.1rem" />}
                  color="red"
                  title="Error"
                  onClose={() => setShowError(false)}
                  mb="md"
                >
                  {error}
                </Notification>
              )}

              <Group justify="flex-end" mb="sm">
                <Text size="sm" c="dimmed">
                  Already have an account?{" "}
                  <Anchor component={Link} href="/login" c="violet">
                    Sign In
                  </Anchor>
                </Text>
              </Group>

              <Title order={2} mb="xl" c="gray.8">Sign Up</Title>

              <Stack>
                <Group grow>
                  <Button
                    leftSection={<IconBrandGithub size={20} />}
                    variant="default"
                    radius="md"
                    fullWidth
                  >
                    GitHub
                  </Button>
                  <Button
                    leftSection={<IconBrandGoogle size={20} />}
                    variant="default"
                    radius="md"
                    fullWidth
                  >
                    Google
                  </Button>
                </Group>

                <Divider label="OR" labelPosition="center" my="lg" />

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack>
                    <TextInput
                      label="Full Name"
                      placeholder="Your full name"
                      {...form.getInputProps('name')}
                      required
                    />
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      {...form.getInputProps('email')}
                      required
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      description="At least 6 characters with uppercase, lowercase, and number"
                      {...form.getInputProps('password')}
                      required
                    />
                    <Select
                      label="Account Type"
                      placeholder="Select your role"
                      data={[
                        { value: 'user', label: 'Regular User' },
                        { value: 'houseprovider', label: 'House Provider' },
                      ]}
                      {...form.getInputProps('role')}
                      required
                    />
                    {/* <Checkbox
                      label={
                        <Text size="sm">
                          I agree to the{" "}
                          <Anchor href="/terms" size="sm">
                            Terms of service
                          </Anchor>{" "}
                          and{" "}
                          <Anchor href="/privacy" size="sm">
                            Privacy policy
                          </Anchor>
                        </Text>
                      }
                      required
                    /> */}

                    <Button
                      type="submit"
                      color="violet"
                      radius="md"
                      size="md"
                      fullWidth
                      loading={loading}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Paper>
          </div>
        </div>
      </main>
    </div>
  );
}