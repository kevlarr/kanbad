import { useState } from 'react'
import { GetServerSideProps } from 'next'

import api from '@/lib/api'
import { BoardModel, BoardParams, CardModel, WorkspaceModel, compareModelFn } from '@/lib/models'
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
  // TODO:
  //   - Is this a smell, creating state & hooks from props?
  //   - Should they be loaded client-side within the component?
  //   - Is this managing too much state, ie. a collection of boards and cards,
  //     and should there be a different state management solution?
  //
  // The reason this is managing cards 'globally' instead of each board managing
  // its own cards was partially about efficient data loading but also about
  // implementing drag & drop of cards between boards.
  //
  // The joke is that this page is essentially the entire app in and of itself.
  const [boardList, setBoards] = useState(boards.sort(compareModelFn))
  const [cardList, setCards] = useState(cards.sort(compareModelFn))

  async function createBoard() {
    const data = {
      title: 'New Board',
      workspace: workspace.identifier,
    }

    return await api.post('boards', data).then((newBoard) => {
      setBoards([...boardList, newBoard])
    })
  }

  async function updateBoard(board: BoardModel, params: BoardParams) {
    return await api.put(`boards/${board.identifier}`, params)
      .then((updatedBoard) => {
        setBoards(boardList.map((existingBoard) => (
          existingBoard.identifier === updatedBoard.identifier
            ? updatedBoard
            : existingBoard
        )))
      })
  }

  async function removeBoard(board: BoardModel) {
    return await api.delete(`boards/${board.identifier}`)
      .then(() => {
        setBoards(boardList.filter((b) => (
          b.identifier !== board.identifier
        )))
      })
  }

  async function createCard(board: BoardModel) {
    const data = {
      board: board.identifier,
      title: 'New Card',
    }

    return await api.post('cards', data).then((newCard) => {
      setCards([...cardList, newCard])
    })
  }

  const cardsMap =
    cardList.reduce((map: BoardCardsMap, card: CardModel) => {
      map[card.board] = map[card.board] || [];
      map[card.board].push(card)
      return map
    }, {})

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
            updateBoard={async (params: BoardParams) => updateBoard(board, params)}
            removeBoard={async () => await removeBoard(board)}
          />
        )}
      </div>
    </div>
  )
}
