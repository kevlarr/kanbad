import { FocusEvent, useMemo, useState } from 'react'

import { getEventDataCard } from '@/lib/dnd'
import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, TextInput } from '@/components/base'
import { Card, SortableList } from '@/components'
import css from './Board.module.css'

interface BoardProps {
  board: BoardModel,
  cards: Array<CardModel> | undefined,
  updateBoard(params: BoardParams): Promise<any>,
  deleteBoard(): any,
  createCard(): any,
  updateCard(card: CardModel, params: CardParams): Promise<any>,
  updateCardLocations(board: BoardModel, card: CardModel, position: number): any,
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
  const [isEditing, setEditing] = useState(false)

  // While there are several ways to make child elements selectable within
  // a draggable parent, they typically don't work in Firefox, but simply
  // setting the draggable attribute to false while inside the content does.
  const [isDraggable, setDraggable] = useState(true)

  const sortedCards = useMemo(
    () => {
      // The moment any list gets reordered, all existing cards get positions.
      // New cards will default to Infinity and be placed at the end of the list.
      //
      // This doesn't specify an ordering for a board where NO cards have a position,
      // but what would be the default there - title? Creation date?
      const position = (card: CardModel) => card.position ?? Infinity

      function byPosition(a: CardModel, b: CardModel) {
        if (position(a) < position(b)) { return -1 }
        if (position(a) > position(b)) { return 1 }
        return 0
      }

      return cards?.sort(byPosition)
    },
    [cards],
  )

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

  const cardNodes = sortedCards?.map((card) => (
      <Card
        key={card.identifier}
        card={card}
        updateCard={async (params: CardParams) => await updateCard(card, params)}
        deleteCard={async () => await deleteCard(card)}
      />
    ))

  return (
    <FlexContainer
      className={css.board}
      direction='column'
      draggable={isDraggable}
    >
      {/* Wrap all children in another container in order to disable draggability for now */}
      <FlexContainer
        direction='column'
        gap='sm'
        onMouseEnter={() => setDraggable(false)}
        onMouseLeave={() => setDraggable(true)}
      >
        {boardHeader}
        <SortableList<CardModel>
          draggables={cardNodes ?? []}
          getEventItem={getEventDataCard}
          onDropPosition={(card, position) => updateCardLocations(board, card, position)}
        />
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
    </FlexContainer>
  )
}
