import { FocusEvent, useState } from 'react'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import { Button, Heading } from '@/components/base'
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
}

export default function Board({
  board,
  cards,
  updateBoard,
  deleteBoard,
  createCard,
  updateCard,
  deleteCard,
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
    ? <input
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
    <div className={css.board}>
      <div className={css.boardHeader}>
        {boardHeader}
      </div>
      {cards?.map(card =>
        <Card
        key={card.identifier}
        card={card}
        updateCard={async (params: CardParams) => await updateCard(card, params)}
        deleteCard={async () => await deleteCard(card)}
        />
      )}
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
    </div>
  )
}
