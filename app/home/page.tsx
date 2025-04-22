'use client'

import Cards from "@/components/card"
import { Button, Container, Group, Select, SimpleGrid } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"

const Home = () => {
    return(
        <Container size='lg'>
            <Group justify='center'  mt={10} bg='white' p={10}>
            <Select
    //   label="Your favorite library"
      placeholder="Gender"
      data={['Female', 'Male',]}
      searchable
      clearable
    //   size="lg"
    />
            <Select
    //   label="Your favorite library"
      placeholder="Budget"
      data={['Female', 'Male',]}
      searchable
      clearable
    //   size="lg"
    />
            <Select
    //   label="Your favorite library"
      placeholder="Location"
      data={['Female', 'Male',]}
      searchable
      clearable
    //   size="lg"
    />
    <Button leftSection={<IconSearch size={16}/>}>Find Roommate</Button>
            </Group>
            {/* <SimpleGrid cols={3}>

            </SimpleGrid> */}
            
          <Cards />
        </Container>
    )
}

export default Home