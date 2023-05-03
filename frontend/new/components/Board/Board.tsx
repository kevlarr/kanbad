import { FocusEvent, useState } from 'react'

import { BoardModel, BoardParams, CardModel } from '@/lib/models'
import Card from '@/components/Card/Card'
import css from './Board.module.css'

interface IProps {
  board: BoardModel,
  cards: Array<CardModel> | undefined,
  createCard(): any,
  updateBoard(params: BoardParams): Promise<any>,
  removeBoard(): any,
}

export default function Board({ board, cards, createCard, updateBoard, removeBoard }: IProps) {
  const [isEditing, setEditing] = useState(false)

  async function updateTitle(evt: FocusEvent) {
    const title = (evt.target as HTMLInputElement).value

    if (title === board.title) {
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
          />
        )}
      </div>
      <div className={css.controls}>
        <button onClick={createCard}>+ Add Card</button>
        <button onClick={removeBoard}>- Remove Board</button>
      </div>
    </div>
  )
}
