import { DragEvent, useState } from 'react'
import { GetServerSideProps } from 'next'

import api from '@/lib/api'
import {
  BoardModel,
  BoardParams,
  CardModel,
  CardParams,
  CardLocationParams,
  WorkspaceModel,
  compareModelFn,
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
  // The joke is that this page is essentially the entire app in and of itself,
  // storing the global state for the entire workspace and setting up all of the
  // hooks, API calls, etc.
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

  async function createCard(board: BoardModel) {
    const data = {
      board: board.identifier,
      title: 'New Card',
    }

    return await api.post('cards', data).then((newCard) => {
      setCards([...cardList, newCard])
    })
  }

  // TODO: Abstract this away - this is duplicated from `updateBoard`,
  // and same with `deleteCard`
  async function updateCard(card: CardModel, params: CardParams) {
    return await api.patch(`cards/${card.identifier}`, params)
      .then((updatedCard) => {
        setCards(cardList.map((existingCard) => (
          existingCard.identifier === updatedCard.identifier
            ? updatedCard
            : existingCard
        )))
      })
  }

  async function updateCardLocations(paramList: Array<CardLocationParams>) {
    return await api.patch(`cards`, paramList)
      .then((updatedCards) => {
        // FIXME: Optimize this
        updatedCards.forEach((updatedCard: CardModel) => {
          setCards(cardList.map((existingCard) => (
            existingCard.identifier === updatedCard.identifier
              ? updatedCard
              : existingCard
          )))
        })
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

  // And now to define and pass down EVEN MORE handlers. Yeesh.
  function onCardDrag(evt: DragEvent, card: CardModel) {
    console.debug(`DRAG: card ${card.identifier}`)
  }

  function onCardDragStart(evt: DragEvent, card: CardModel) {
    console.debug(`DRAG-START: card ${card.identifier}`)

    // Using a custom data type helps for a few reasons:
    //
    // - All default drag events will set `text/plain` so using a custom type
    //   makes it easier for the drop zone to cancel drags from other types
    //
    // - Not including `text/plain` type means that the card can't be dragged
    //   into a drop zone on another site (since there is nothing meaningful
    //   to share)
    //
    // See: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#dragging_custom_data
    evt.dataTransfer.setData('kanbad/cardId', card.identifier)
  }

  function onCardDragEnd(evt: DragEvent, card: CardModel) {
    console.debug(`DRAG-END: card ${card.identifier}`)
  }

  function onCardDragOver(evt: DragEvent, board: BoardModel) {
    const cardId = evt.dataTransfer.getData('kanbad/cardId')

    if (!cardId) {
      return false
    }

    evt.preventDefault()
    console.debug(`DRAG-OVER: Board ${board.identifier}`)
  }

  function onCardDrop(evt: DragEvent, board: BoardModel) {
    const cardId = evt.dataTransfer.getData('kanbad/cardId')
    const card = cardList.find((card) => card.identifier === cardId)!

    console.log(`DROP: Card<${card.identifier}> on Board<${board.identifier}>`)

    if (card.board === board.identifier) {
      return
    }

    updateCardLocations([{
      card: card.identifier,
      board: board.identifier,
    }])
  }

  const cardsByBoard =
    cardList.reduce((map: BoardCardsMap, card: CardModel) => {
      map[card.board] = map[card.board] || [];
      map[card.board].push(card)
      return map
    }, {})

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
              deleteCard={deleteCard}
              onCardDrag={onCardDrag}
              onCardDragStart={onCardDragStart}
              onCardDragEnd={onCardDragEnd}
              onCardDragOver={onCardDragOver}
              onCardDrop={onCardDrop}
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
