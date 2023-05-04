import { FocusEvent, useState } from 'react'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import Card from '@/components/Card/Card'
import css from './Board.module.css'

interface IProps {
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
}: IProps) {
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
        className={css.titleInput}
        autoFocus={true}
        defaultValue={board.title}
        onBlur={updateTitle}
      />
    : <h3
        className={css.title}
        onClick={() => setEditing(true)}
      >
        {board.title}
      </h3>

  return (
    <div className={css.board}>
      {boardHeader}
      <div className={css.cards}>
        {cards?.map(card =>
          <Card
            key={card.identifier}
            card={card}
            updateCard={async (params: CardParams) => await updateCard(card, params)}
            deleteCard={async () => await deleteCard(card)}
          />
        )}
      </div>
      <div className={css.controls}>
        <button onClick={createCard}>+ Add Card</button>
        <button onClick={deleteBoard}>- Remove Board</button>
      </div>
    </div>
  )
}
