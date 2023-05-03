import { useState } from 'react'
import { GetServerSideProps } from 'next'

import api from '@/lib/api'
import { BoardModel, CardModel, WorkspaceModel } from '@/lib/models'
import Board from '@/components/Board/Board'
import css from './uuid.module.css'

type BoardCardsMap = { [index: string] : Array<CardModel> }

interface IProps {
  boards: Array<BoardModel>,
  cards: Array<CardModel>,
  workspace: WorkspaceModel,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: Proper way to `type` context & uuid, etc?
  const { uuid } = context.query
  const [boards, cards, workspace] = await Promise.all([
    api.get(`boards?workspace=${uuid}`),
    api.get(`cards?workspace=${uuid}`),
    api.get(`workspaces/${uuid}`),
  ])

  return {
    props: {
      boards,
      cards,
      workspace,
    }
  }
}

export default function WorkspacePage({ boards, cards, workspace }: IProps) {
  const [boardList, setBoards] = useState(boards)
  const [cardList, setCards] = useState(cards)

  const cardsMap =
    cardList.reduce((map: BoardCardsMap, card: CardModel) => {
      map[card.board] = map[card.board] || [];
      map[card.board].push(card)
      return map
    }, {})

  async function createBoard() {
    const data = {
      title: 'New Board',
      workspace: workspace.identifier,
    }
    await api.post('boards', data).then((newBoard) => {
      setBoards([...boardList, newBoard])
    })
  }

  async function removeBoard(board: BoardModel) {
    await api.delete(`boards/${board.identifier}`).then(() => {
      setBoards(boardList.filter((b) => b.identifier !== board.identifier))
    })
  }

  async function createCard(board: BoardModel) {
    const data = {
      board: board.identifier,
      title: 'New Card',
    }
    await api.post('cards', data).then((newCard) => {
      setCards([...cardList, newCard])
    })
  }

  return (
    <div className={css.workspace}>
      <div className={css.meta}>
        <button className={css.addBoard} onClick={createBoard}>+ Add Board</button>
        <h2 className={css.identifier}>{workspace.identifier}</h2>
        <p className={css.disclaimer}>
          Make sure to <strong><span className={css.star}>★</span>bookmark</strong> this page.
          While we won't lose the workspace, losing the address means you probably will.
        </p>
      </div>
      <div className={css.boards}>
        {boardList.map((board) =>
          <Board
            key={board.identifier}
            board={board}
            cards={cardsMap[board.identifier]}
            createCard={async () => await createCard(board)}
            removeBoard={async () => await removeBoard(board)}
          />
        )}
      </div>
    </div>
  )
}
