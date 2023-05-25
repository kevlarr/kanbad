import { DragEvent, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getEventDataWorkspace, setEventDataWorkspace } from '@/lib/dnd'
import { WorkspaceModel } from '@/lib/models'
import { Button, FlexContainer, Heading } from '@/components/base'
import { SortableList } from '@/components'
import css from './PageHeader.module.css'

interface PageHeaderProps {
  workspaces: Array<WorkspaceModel>,
  createWorkspace(title: string): any,
  updateWorkspaceLocations(workspace: WorkspaceModel, position: number): any,
}

export default function PageHeader({
  workspaces,
  createWorkspace,
  updateWorkspaceLocations,
}: PageHeaderProps) {
  const { asPath: path } = useRouter()

  // TODO: This is copied & pasted from `Board`
  const sortedWorkspaces = useMemo(
    () => {
      const position = (workspace: WorkspaceModel) => workspace.position ?? Infinity

      function byPosition(a: WorkspaceModel, b: WorkspaceModel) {
        if (position(a) < position(b)) { return -1 }
        if (position(a) > position(b)) { return 1 }
        return 0
      }

      return workspaces?.sort(byPosition)
    },
    [workspaces],
  )

  function onDragStart(evt: DragEvent, workspace: WorkspaceModel) {
    evt.stopPropagation()
    setEventDataWorkspace(evt, workspace)
  }

  function onDrag(evt: DragEvent) {
    evt.stopPropagation()
  }

  function onDragEnd(evt: DragEvent) {
    evt.stopPropagation()
  }

  const isActive = (workspace: WorkspaceModel) => path === `/workspaces/${workspace.identifier}`

  const workspaceElements = sortedWorkspaces.map((workspace) => {
    const classes = [
      css.workspaceLink,
      isActive(workspace) ? css.activeWorkspace : null,
    ]

    return (
      <Link
        key={workspace.identifier}
        className={classes.join(' ')}
        href={`/workspaces/${workspace.identifier}`}
        draggable={true}
        onDragStart={(e) => onDragStart(e, workspace)}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        {workspace.title}
      </Link>
    )
  })

  const content = workspaces.length > 0
    ? <>
        <Heading
          className={css.workspacesHeading}
          level={2}
          underline
        >
          Workspaces
        </Heading>
        <SortableList<WorkspaceModel>
          gap='sm'
          pad='sm'
          draggables={workspaceElements}
          getEventItem={getEventDataWorkspace}
          onDropPosition={updateWorkspaceLocations}
        />
      </>
    : null

  return (
    <FlexContainer
      className={css.pageHeader}
      direction='column'
    >
      <Link className={css.logotype} href='/'>
        <Heading inline level={1}>kanbad</Heading>
      </Link>
      <FlexContainer className={css.content} direction='column'>
        {content}
      </FlexContainer>
      <FlexContainer direction='column' pad='md'>
        <Button className={css.newWorkspace} variant='outlined' onClick={() => createWorkspace('New Workspace')}>
          New Workspace
        </Button>
      </FlexContainer>
    </FlexContainer>
  )
}
