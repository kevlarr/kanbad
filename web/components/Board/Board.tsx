import { DragEvent, FocusEvent, Fragment, RefObject, createRef, useState } from 'react'

import { getEventDataCard } from '@/lib/dnd'
import { BoardModel, BoardParams, CardModel, CardLocationParams, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, TextInput } from '@/components/base'
import { Card, Dropzone } from '@/components'
import css from './Board.module.css'

interface BoardProps {
  board: BoardModel,
  cards: Array<CardModel> | undefined,
  updateBoard(params: BoardParams): Promise<any>,
  deleteBoard(): any,
  createCard(): any,
  updateCard(card: CardModel, params: CardParams): Promise<any>,
  updateCardLocations(paramList: Array<CardLocationParams>): any,
  deleteCard(card: CardModel): any,
}

export default function Board({
  board,
  cards,
  updateBoard,
  deleteBoard,
  createCard,
  updateCard,
  updateCardLocations,
  deleteCard,
}: BoardProps) {
  const [activeDropzone, setActiveDropzone] = useState(-1)
  const [isEditing, setEditing] = useState(false)

  const dropzoneRefs: Array<RefObject<HTMLDivElement>> = [
    createRef(),
    ...((cards?.map(() => createRef()) || []) as Array<RefObject<HTMLDivElement>>)
  ]

  async function updateTitle(evt: FocusEvent) {
    const title = (evt.target as HTMLInputElement).value

    if (title === board.title) {
      setEditing(false)
      return
    }

    updateBoard({ title })
      .then(() => setEditing(false))
  }

  function onDragEnter(evt: DragEvent) {
    console.debug(`DRAG-ENTER: board<${board.identifier}>`)
    evt.stopPropagation()
  }

  function onDragLeave(evt: DragEvent) {
    console.debug(`DRAG-LEAVE: board<${board.identifier}>`)
    evt.stopPropagation()
    setActiveDropzone(-1)
  }

  function onDragOver(evt: DragEvent) {
    console.debug(`DRAG-OVER: board<${board.identifier}>`)
    evt.stopPropagation()

    const card = getEventDataCard(evt)

    if (!card) {
      return
    }

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

    // The dropzone immediately before or after the card should never
    // activate, since it doesn't make sense to position a card before
    // or after itself.
    //
    // Given:
    //   Dropzone i=0
    //   Card     j=0
    //   Dropzone i=1 <Never activate>
    //   Card     j=1 <If dragging>
    //   Dropzone i=2 <Never activate>
    //
    // If the second card (j=1) is being dragged, then dropzones at
    // 1 & 2
    //
    // Note: This only applies if the card being dragged is currently
    // on the board already
    if (
      card &&
      card.board === board.identifier &&
      (
        card.identifier === (cards && cards[closest]?.identifier) ||
        card.identifier === (cards && cards[closest - 1]?.identifier)
      )
    ) {
      setActiveDropzone(-1)
    } else {
      setActiveDropzone(closest!)
    }
  }

  function onDrop(evt: DragEvent) {
    console.debug(`DROP: board<${board.identifier}>`)
    evt.stopPropagation()

    const card = getEventDataCard(evt)

    if (!card) {
      return
    }

    // Cancel the event to tell the browser this IS a valid drop zone
    // for the type being dragged
    evt.preventDefault()
    setActiveDropzone(-1)

    if (card.board === board.identifier) {
      return
    }

    updateCardLocations([{
      card: card.identifier,
      board: board.identifier,
    }])
  }

  const boardHeader = isEditing
    ? <TextInput
        autoFocus={true}
        defaultValue={board.title}
        onBlur={updateTitle}
      />
    : <Heading
        level={3}
        onClick={() => setEditing(true)}
      >
        {board.title}
      </Heading>

  const dropzone = (i: number, key: boolean = false) => <Dropzone
    ref={dropzoneRefs[i]}
    active={i === activeDropzone}
    {...(key && { key: `drop${i}` })}
  />

  return (
    <FlexContainer
      className={css.board}
      direction='column'
      gap='sm'
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {boardHeader}
      <FlexContainer direction='column' gap='sm'>
        {dropzone(0)}
        {cards?.map((card, i) =>
          <Fragment key={card.identifier}>
            <Card
              key={card.identifier}
              card={card}
              updateCard={async (params: CardParams) => await updateCard(card, params)}
              deleteCard={async () => await deleteCard(card)}
            />
            {dropzone(i + 1, true)}
          </Fragment>
        )}
      </FlexContainer>
      <FlexContainer gap='sm'>
        <Button
          compact
          size='sm'
          variant='subtle'
          onClick={createCard
        }>
          Add Card
        </Button>
        <Button
          compact
          warn
          size='sm'
          variant='subtle'
          onClick={deleteBoard}
        >
          Remove Board
        </Button>
      </FlexContainer>
    </FlexContainer>
  )
}
