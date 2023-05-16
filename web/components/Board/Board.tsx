import { DragEvent, FocusEvent, Fragment, RefObject, SyntheticEvent, createRef, useState } from 'react'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, TextInput } from '@/components/base'
import { Card, Dropzone } from '@/components'
import css from './Board.module.css'

interface DraggingCard {
  card: CardModel,
  index: number,
}

interface BoardProps {
  board: BoardModel,
  cards: Array<CardModel> | undefined,
  updateBoard(params: BoardParams): Promise<any>,
  deleteBoard(): any,
  createCard(): any,
  updateCard(card: CardModel, params: CardParams): Promise<any>,
  deleteCard(card: CardModel): any,
  // Card drag handlers
  // TODO: Type these
  onCardDrag(evt: DragEvent, card: CardModel): any,
  onCardDragStart(evt: DragEvent, card: CardModel): any,
  onCardDragEnd(evt: DragEvent, card: CardModel): any,
  onCardDragOver(evt: DragEvent, board: BoardModel): any,
  onCardDrop(evt: DragEvent, board: BoardModel): any,
}

export default function Board({
  board,
  cards,
  updateBoard,
  deleteBoard,
  createCard,
  updateCard,
  deleteCard,
  onCardDrag,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onCardDrop,
}: BoardProps) {
  const [activeDropzone, setActiveDropzone] = useState(-1)
  const [draggingCard, setDraggingCard] = useState<DraggingCard | null>(null)
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

  function onDragOver(evt: DragEvent) {
    const { clientY } = evt
    let closest: number
    let closestDist: number

    dropzoneRefs.forEach((ref, i) => {
      const { offsetTop } = ref.current!
      const dist = Math.abs(offsetTop - clientY)

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
    console.debug(`draggingCard.card.board: ${draggingCard?.card.board}`)
    console.debug(`draggingCard.index: ${draggingCard?.index}`)
    console.debug(`board: ${board.identifier}`)
    console.debug(`dropzone: ${closest!}`)

    if (
      draggingCard &&
      draggingCard.card.board === board.identifier &&
      (
        draggingCard.index === closest! ||
        draggingCard.index === closest! - 1
      )
    ) {
      setActiveDropzone(-1)
    } else {
      setActiveDropzone(closest!)
    }

    // TODO: Comment why this is necessary because I already forgot
    onCardDragOver(evt, board)
  }

  function onDragStart(evt: DragEvent, card: CardModel, index: number) {
    setDraggingCard({ card, index })
    onCardDragStart(evt, card)
  }

  function onDragEnter(evt: DragEvent) {
    console.log(`enter board ${board.identifier}`)
  }

  function onDragLeave(evt: DragEvent) {
    if (evt.currentTarget === evt.target) {
      setActiveDropzone(-1)

      // FIXME: Getting messy... dropping a card onto another board won't clear the `draggingCard`
      // state from the origin board (or any others it was dragged over) but clearing that on leave
      // complicates setting it if the card is dragged back OVER
      //
      // Should MOST of this then be handled in the broader workspace that sets up all the other handlers?
      // Like, should `draggingCard` be passed in as a prop, and this only handles tracking the drop zone
      // that's being activated?
      setDraggingCard(null)
    }
  }

  function onDrop(evt: DragEvent) {
    setActiveDropzone(-1)
    setDraggingCard(null)
    return onCardDrop(evt, board)
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
      onDragOver={onDragOver}
      onDragEnter={(onDragEnter)}
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
              onDrag={onCardDrag}
              onDragStart={(e) => onDragStart(e, card, i)}
              onDragEnd={onCardDragEnd}
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
