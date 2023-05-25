import { DragEvent, useMemo } from 'react'
import Link from 'next/link'

import { getEventDataWorkspace, setEventDataWorkspace } from '@/lib/dnd'
import { WorkspaceModel } from '@/lib/models'
import { FlexContainer, Heading } from '@/components/base'
import { SortableList } from '@/components'
import css from './PageHeader.module.css'

interface PageHeaderProps {
  workspaces: Array<WorkspaceModel>,
  updateWorkspaceLocations(workspace: WorkspaceModel, position: number): any,
}

export default function PageHeader({
  workspaces,
  updateWorkspaceLocations,
}: PageHeaderProps) {
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

  const workspaceElements = sortedWorkspaces.map((workspace) => (
    <Link
      key={workspace.identifier}
      className={css.workspaceLink}
      href={`/workspaces/${workspace.identifier}`}
      draggable={true}
      onDragStart={(e) => onDragStart(e, workspace)}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {workspace.title}
    </Link>
  ))

  return (
    <FlexContainer
      className={css.pageHeader}
      direction='column'
      pad='sm'
      gap='md'
    >
      <Link className={css.logotype} href='/'>
        <Heading inline level={1}>kanbad</Heading>
      </Link>
      <SortableList<WorkspaceModel>
        gap='xs'
        draggables={workspaceElements}
        getEventItem={getEventDataWorkspace}
        onDropPosition={updateWorkspaceLocations}
      />
    </FlexContainer>
  )
}
