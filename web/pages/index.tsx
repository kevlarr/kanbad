import { useRouter } from 'next/router'
import { Center, Container, Stack } from '@mantine/core'

import { Button, Heading, Text } from '@/components/base'
import api from '@/lib/api'

export default function Index() {
  const router = useRouter()

  function createWorkspace() {
    api
      .post('workspaces')
      .then(({ identifier}) => router.push(`workspaces/${identifier}`))
  }

  return (
    <Center style={{ width: '100%' }}>
      <Container>
        <Stack align='center' spacing='xl' p='xl'>
          <Heading level={1}>Hello, from Kanbad!</Heading>
          <Text>
            Workspaces give you places to make things like boards and cards... and magic!
            Create a new one or, if you're really lucky, get a friend to share a workspace with you.
          </Text>
          <Button onClick={createWorkspace}>
            Create workspace
          </Button>
        </Stack>
      </Container>
    </Center>
  )
}
