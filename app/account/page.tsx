'use client'
import { Container, Divider, Text, Title } from "@mantine/core"
import Form from "./stepper"

const Account = () => {
    return(
        <Container size='xl' pt={20} >
            <Divider />
            <Title order={3}>Set up your account to find roommate/room</Title>
            <Text>Holla!, Fill in the details to complete sign up</Text>

            <Form />
        </Container>
    )
}

export default Account