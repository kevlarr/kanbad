import { Text } from '@/components'
import css from './Workspace.module.css'

interface IProps {
  identifier: string,
  createBoard(): any,
}

export default function WorkspaceHeader({ identifier, createBoard }: IProps) {
  return (
    <div className={css.header}>
      <h2>{identifier}</h2>
      <Text>
        Make sure to <Text inline strong>★bookmark</Text> this page.
        While we won't lose the workspace, losing the address means you probably will.
      </Text>
    </div>
  )
}
