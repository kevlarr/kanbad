import { DragEvent, FocusEvent, Fragment, RefObject, createRef, useState } from 'react'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
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
  const [isEditing, setEditing] = useState(false)
  const [activeDropzone, setActiveDropzone] = useState(-1)

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

      if (!closestDist || dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })

    setActiveDropzone(closest!)
    return onCardDragOver(evt, board)
  }

  function onDragLeave(evt: DragEvent) {
    setActiveDropzone(-1)
  }

  function onDrop(evt: DragEvent) {
    setActiveDropzone(-1)
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
              onDragStart={onCardDragStart}
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
