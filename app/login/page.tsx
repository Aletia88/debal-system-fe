'use client'
import { Anchor, Button, Checkbox, Divider, Group, Image, Paper, PasswordInput, Stack, Text, TextInput, Title, rem } from "@mantine/core";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { loginSuccess, loginFailure } from "@/store/authSlice";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export default function SignUpPage() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (value.trim().length === 0 ? "email is required" : null),
      password: (value) => (value.length < 6 ? "Password must be at least 6 characters" : null),
    },
  });

  const handleSubmit = async (values: any) => {
    console.log("Form values submitted:", values); // Debugging
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
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
        router.push("/");
      } else {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          console.error("Error Response:", errorData);
          dispatch(loginFailure(errorData.detail || "Login failed"));
          setError(errorData.detail || "Login failed");
        } catch (err) {
          console.error("Non-JSON Error Response:", errorText);
          dispatch(loginFailure("Login failed"));
          setError("Login failed");
        }
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      dispatch(loginFailure("An error occurred"));
      // notify("Error", err?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main className="p-0 md:p-10" style={{ flex: 1, display: 'flex', alignItems: 'center',  }}>
        <div style={{ width: '100%', maxWidth: rem(1200), margin: '0 auto' }}>
          {/* <div style={{ marginBottom: rem(32) }}>
            <Title order={1} c="gray.8">Sign Up</Title>
            <Text c="gray.6" mt="sm">Signup to contact your match</Text>
          </div> */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: rem(32),
            alignItems: 'center'
          }}>
            <div className="hidden md:block" style={{
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
              <Group justify="flex-end" mb="sm">
                <Text size="sm" c="dimmed">
                  Don't have an account?{" "}
                  <Anchor component={Link} href="/signup" c="violet">
                    Sign Up
                  </Anchor>
                </Text>
              </Group>

              <Title order={2} mb="xl" c="gray.8">Sign In</Title>

              <Stack>
                <Group grow>
                  <Button
                    leftSection={<IconBrandGithub size={20} />}
                    variant="default"
                    radius="md"
                    fullWidth
                    onClick={()=> router.push(`${baseUrl}api/auth/github`)}
                  >
                   
         GitHub
   
                    
                  </Button>
                  <Button
                    leftSection={<IconBrandGoogle size={20} />}
                    variant="default"
                    radius="md"
                    fullWidth
                    onClick={()=> router.push(`${baseUrl}api/auth/google`)}
                  >
                    Google
                  </Button>
                </Group>

                <Divider label="OR" labelPosition="center" my="lg" />

                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                  <Stack>
                    <TextInput
                      label="Email"
                      placeholder="Type Your email"
                      {...form.getInputProps("email")}
                      required
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Type Your Password"
                      {...form.getInputProps("password")}
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
                  /> */}
                    <Button
                      type="submit"
                      color="violet"
                      radius="md"
                      size="md"
                      fullWidth
                    >
                      Sign In
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