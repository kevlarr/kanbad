import { useRouter } from 'next/router'

import { Button, FlexContainer, Heading, Text } from '@/components/base'
import api from '@/lib/api'

interface IndexProps {
  addWorkspace(identifier: string): any,
}

export default function Index({ addWorkspace }: IndexProps) {
  const router = useRouter()

  function createWorkspace() {
    api
      .post('workspaces')
      .then(({ identifier}) => {
        addWorkspace(identifier)
        router.push(`workspaces/${identifier}`)
    })
  }

  return (
    <FlexContainer direction='column' gap='xl' pad='xl'>
      <Heading level={1}>Hello, from Kanbad!</Heading>
      <Text>Workspaces give you places to make things like boards and cards... and magic!</Text>
      <Text>Create a new one or, if you're really lucky, get a friend to share a workspace with you.</Text>
      <div>
        <Button onClick={createWorkspace}>
          Create workspace
        </Button>
      </div>
    </FlexContainer>
  )
}
