import { DragEvent, FocusEvent, useState } from 'react'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, TextInput } from '@/components/base'
import { Card } from '@/components'
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

  async function updateTitle(evt: FocusEvent) {
    const title = (evt.target as HTMLInputElement).value

    if (title === board.title) {
      setEditing(false)
      return
    }

    updateBoard({ title })
      .then(() => setEditing(false))
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

  return (
    <FlexContainer
      className={css.board}
      direction='column'
      gap='md'
      onDragOver={(e) => onCardDragOver(e, board)}
      onDrop={(e) => onCardDrop(e, board)}
    >
      {boardHeader}
      {cards &&
        <FlexContainer direction='column' gap='lg'>
          {cards?.map(card =>
            <Card
              key={card.identifier}
              card={card}
              updateCard={async (params: CardParams) => await updateCard(card, params)}
              deleteCard={async () => await deleteCard(card)}
              onDrag={onCardDrag}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
            />
          )}
        </FlexContainer>
      }
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
