import { Heading, Text } from '@/components/base'
import css from './Workspace.module.css'

interface WprkspaceHeaderProps {
  identifier: string,
  createBoard(): any,
}

export default function WorkspaceHeader({
  identifier,
  createBoard,
}: WprkspaceHeaderProps) {
  return (
    <div className={css.header}>
      <Heading level={2}>{identifier}</Heading>
      <Text>
        Make sure to <Text inline strong>★bookmark</Text> this page.
        While we won't lose the workspace, losing the address means you probably will.
      </Text>
    </div>
  )
}
