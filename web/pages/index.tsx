import { Button, FlexContainer, Heading, Text } from '@/components/base'

interface IndexProps {
  createWorkspace(title: string): any,
}

export default function Index({ createWorkspace }: IndexProps) {
  return (
    <FlexContainer direction='column' gap='xl' pad='xl'>
      <Heading level={1}>Hello, from Kanbad!</Heading>
      <Text>Workspaces give you places to make things like boards and cards... and magic!</Text>
      <Text>Create a new one or, if you're really lucky, get a friend to share a workspace with you.</Text>
      <div>
        <Button onClick={() => createWorkspace('New Workspace')}>
          Create workspace
        </Button>
      </div>
    </FlexContainer>
  )
}
