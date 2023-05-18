import { useMemo, useState } from 'react'
import { GetServerSideProps } from 'next'

import api from '@/lib/api'
import {
  BoardModel,
  BoardParams,
  CardModel,
  CardParams,
  CardLocationParams,
  WorkspaceModel,
} from '@/lib/models'
import { Button, FlexContainer } from '@/components/base'
import { Board, WorkspaceHeader } from '@/components'
import css from './uuid.module.css'

type BoardCardsMap = { [index: string] : Array<CardModel> }

interface WorkspacePageProps {
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

export default function WorkspacePage({
  boards,
  cards,
  workspace,
}: WorkspacePageProps) {
  /* TODO:
   *   - Is this a smell, creating state & hooks from props?
   *   - Should they be loaded client-side within the component?
   *   - Is this managing too much state, ie. a collection of boards and cards,
   *     and should there be a different state management solution?
   *
   * The joke is that this page is essentially an entire app in and of itself,
   * storing the global state for the entire workspace and setting up all of the
   * drag event hooks, API calls, etc.
   */
  const [boardList, setBoards] = useState(boards)
  const [cardList, setCards] = useState(cards)

  const cardsByBoard = useMemo(
    () => cardList.reduce((map: BoardCardsMap, card: CardModel) => {
      map[card.board] = map[card.board] || [];
      map[card.board].push(card)
      return map
    }, {}),
    [cardList],
  )

  /* Board CRUD handlers
   */
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
    return await api.patch(`boards/${board.identifier}`, params)
      .then((updatedBoard) => {
        setBoards(boardList.map((existingBoard) => (
          existingBoard.identifier === updatedBoard.identifier
            ? updatedBoard
            : existingBoard
        )))
      })
  }

  async function deleteBoard(board: BoardModel) {
    return await api.delete(`boards/${board.identifier}`)
      .then(() => {
        setBoards(boardList.filter((b) => (
          b.identifier !== board.identifier
        )))
      })
  }

  /* Card CRUD handlers
   *
   * The reason this is managing cards 'globally' instead of each board managing
   * its own cards was partially about efficient data loading but also about
   * implementing drag & drop of cards between boards.
   */

  async function createCard(board: BoardModel) {
    const data = {
      board: board.identifier,
      title: 'New Card',
    }

    return await api.post('cards', data).then((newCard) => {
      setCards([...cardList, newCard])
    })
  }

  async function updateCard(card: CardModel, params: CardParams) {
    // TODO: Abstract this away - this is duplicated from `updateBoard`,
    // and same with `deleteCard`
    return await api.patch(`cards/${card.identifier}`, params)
      .then((updatedCard) => {
        setCards(cardList.map((existingCard) => (
          existingCard.identifier === updatedCard.identifier
            ? updatedCard
            : existingCard
        )))
      })
  }

  async function updateCardLocations(board: BoardModel, card: CardModel, position: number) {
    // Regardless of whether or not the card is being moved to a different board
    // or simply reordered in its current board, this builds an appropriate list
    // of cards by position in the "destination" board...
    const destinationBoardCards = (cardsByBoard[board.identifier] || [])
      .filter((c) => c.identifier !== card.identifier)

    let paramList = [
      ...destinationBoardCards.slice(0, position),
      card,
      ...destinationBoardCards.slice(position),
    ].map((c, i) => ({
      board: board.identifier,
      card: c.identifier,
      position: i,
     }))

    // ... but if it IS being moved to a different board, the previous board's cards
    // all need to have their positions updated, too.

    if (card.board !== board.identifier) {
      paramList = paramList.concat(
        cardsByBoard[card.board]
          .filter((c) => c.identifier !== card.identifier)
          .map((c, i) => ({
            board: card.board,
            card: c.identifier,
            position: i,
          }))
      )
    }

    return await api.patch(`cards`, paramList)
      .then((updatedCards) => {
        const updatedById = updatedCards.reduce((obj: any, c: CardModel) => ({
          ...obj,
          [c.identifier]: c,
        }), {})

        setCards(cardList.map((c) => updatedById[c.identifier] ?? c))
      })
  }

  async function deleteCard(card: CardModel) {
    return await api.delete(`cards/${card.identifier}`)
      .then(() => {
        setCards(cardList.filter((b) => (
          b.identifier !== card.identifier
        )))
      })
  }

  return (
    <FlexContainer className={css.workspace} direction='column' gap='lg' scroll='y'>
      <WorkspaceHeader
        identifier={workspace.identifier}
        createBoard={createBoard}
      />
      {boardList &&
        <FlexContainer direction='column' gap='xl'>
          {boardList.map((board) =>
            <Board
              key={board.identifier}
              board={board}
              cards={cardsByBoard[board.identifier]}
              updateBoard={async (params: BoardParams) => updateBoard(board, params)}
              deleteBoard={async () => await deleteBoard(board)}
              createCard={async () => await createCard(board)}
              updateCard={updateCard}
              updateCardLocations={updateCardLocations}
              deleteCard={deleteCard}
            />
          )}
        </FlexContainer>
      }
      {/* Wrap in a container so the button doesn't stretch full width */}
      <FlexContainer>
        <Button variant='outlined' onClick={createBoard}>
          Add Board
        </Button>
      </FlexContainer>
    </FlexContainer>
  )
}
