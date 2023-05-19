import { ComponentProps, DragEvent, Fragment, ReactElement, RefObject, createRef, useState } from 'react'

import { Model } from '@/lib/models'
import { FlexContainer } from '@/components/base'
import { Dropzone } from '@/components'

type BaseProps = ComponentProps<'div'>

interface SortableListProps<T extends Model> extends BaseProps {
  draggables?: Array<ReactElement>,
  getEventItem(evt: DragEvent): T | null,
  onDropPosition(model: T, position: number): any,
}

export default function SortableList<T extends Model>({
  className,
  draggables = [],
  getEventItem,
  onDropPosition,
  ...rest
}: SortableListProps<T>) {
  const [activeDropzone, setActiveDropzone] = useState(-1)

  const dropzoneRefs: Array<RefObject<HTMLDivElement>> = [
    createRef(),
    ...((draggables?.map(() => createRef()) || []) as Array<RefObject<HTMLDivElement>>)
  ]

  function onDragEnter(evt: DragEvent) {
    evt.stopPropagation()
  }

  function onDragLeave(evt: DragEvent) {
    evt.stopPropagation()
    setActiveDropzone(-1)
  }

  function onDragOver(evt: DragEvent) {
    evt.stopPropagation()

    const model = getEventItem(evt)
    if (!model) { return }

    // Cancel the event to tell the browser this IS a valid drop zone
    // for the type being dragged
    evt.preventDefault()

    const { clientY: evtY } = evt
    let closest = -1
    let closestDist: number

    dropzoneRefs.forEach((ref, i) => {
      const { y: refY } = ref.current!.getBoundingClientRect()
      const dist = Math.abs(refY - evtY)

      if (closestDist === undefined || dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })

    // The dropzone immediately before or after the dragged item should never
    // activate, since it doesn't make sense to position an item before
    // or after itself.
    //
    // Given:
    //   Dropzone i=0
    //   Item     j=0
    //   Dropzone i=1 <Never activate>
    //   Item     j=1 <If dragging>
    //   Dropzone i=2 <Never activate>
    //
    // If the second item (j=1) is being dragged, then dropzones at
    // 1 & 2 should not be activatable, meaning if `closest` is 2 then
    // it needs to be compared to item 1
    //
    // Note: This only applies if the item being dragged is currently
    // in the list of items already
    if (
      // Note: This requires that the key for the draggable element in the list exactly
      // matches the model identifier - parameterize an 'extractor' to allow more flexibility?
      model.identifier === (draggables && draggables[closest]?.key) ||
      model.identifier === (draggables && draggables[closest - 1]?.key)
    ) {
      setActiveDropzone(-1)
    } else {
      setActiveDropzone(closest!)
    }
  }

  function onDrop(evt: DragEvent) {
    evt.stopPropagation()

    const model = getEventItem(evt)
    if (!model) { return }

    // Cancel the event to tell the browser this IS a valid drop zone
    // for the type being dragged
    evt.preventDefault()
    onDropPosition(model, activeDropzone)
    setActiveDropzone(-1)
  }

  const dropzone = (i: number, key: boolean = false) => <Dropzone
    alwaysExpand={draggables.length === 0}
    ref={dropzoneRefs[i]}
    active={i === activeDropzone}
    {...(key && { key: `drop${i}` })}
  />

  return (
    <FlexContainer
      direction='column'
      gap='sm'
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...rest}
    >
      {dropzone(0)}
      {draggables?.map((draggable, i) =>
        <Fragment key={i}>
          {draggable}
          {dropzone(i + 1, true)}
        </Fragment>
      )}
    </FlexContainer>
  )
}
