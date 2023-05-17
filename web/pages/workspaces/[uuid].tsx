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
} from '@/lib/models'
import { Button, FlexContainer } from '@/components/base'
import { Board, WorkspaceHeader } from '@/components'
import css from './uuid.module.css'

/* Using custom data "types" in drag events is useful for a few reasons:
 *
 * - All default drag events will set `text/plain` so using a custom type
 *   makes it easier for the drop zone to cancel drags from other types
 *
 * - Not including `text/plain` type means that the card can't be dragged
 *   into a drop zone on another site (since there is nothing meaningful
 *   to share)
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#dragging_custom_data
 */
const CARD_DRAG_TYPE = 'kanbad/cardId'
const BOARD_DRAG_TYPE = 'kanbad/boardId'

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
  const [draggingCard, setDraggingCard] = useState<CardModel | null>(null)

  const cardsByBoard =
    cardList.reduce((map: BoardCardsMap, card: CardModel) => {
      map[card.board] = map[card.board] || [];
      map[card.board].push(card)
      return map
    }, {})

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

  /* Card drag handlers
   *
   * These are defined in the top-level workspace primarily because they
   * involve interactions BETWEEN boards, rather than just within a
   * single board
   *
   * Draggable elements defined as having...
   *   - the `draggable="true"` attribute
   *   - the `ondragstart` event handler
   *   - (optional) the `ondrag` event handler
   *   - (optional) the `ondragend` event handler
   *
   * Droppable elements (eg. drop zones) are defined as having...
   *   - the `ondragenter` event handler
   *   - the `ondragover` event handler
   *   - (optional) the `ondragleave` event handler
   *   - (optional) the `ondrop` event handler
   */
  function onCardDragStart(evt: DragEvent, card: CardModel) {
    console.debug(`DRAG-START: card<${card.identifier}>`)
    evt.stopPropagation()
    evt.dataTransfer.setData(CARD_DRAG_TYPE, card.identifier)
    evt.dataTransfer.setData(BOARD_DRAG_TYPE, card.board)
    setDraggingCard(card)
  }

  function onCardDrag(evt: DragEvent) {
    console.debug(`DRAG: card<${draggingCard?.identifier}>`)
  }

  function onCardDragOver(evt: DragEvent, board: BoardModel): CardModel | null {
    console.debug(`DRAG-OVER: board<${board.identifier}>, card<${draggingCard?.identifier}>`)

    evt.stopPropagation()
    // Necessary or onDrop won't be called..?
    evt.preventDefault()

    return draggingCard
  }

  // onEnter/onLeave is a workaround for needing to unset the card being dragged
  // when outside of a drop area, since 'dropping' there won't trigger a 'dragend'
  // event and will keep the `draggingCard` set. If that happens, a user can select
  // any other draggable element (eg. plain text), drag it around to boards, and
  // cause the previously-dragged (and canceled) card to be moved
  function onCardDragEnter(evt: DragEvent, board: BoardModel) {
    console.debug(`DRAG-ENTER: board<${board.identifier}>, card<${draggingCard?.identifier}>`)

    const cardId = evt.dataTransfer.getData(CARD_DRAG_TYPE)

    if (!cardId) {
      return
    }

    if (!draggingCard) {
      // TODO: Avoid iterating through all cards when entering any valid drop area
      setDraggingCard(cards.find((c) => c.identifier === cardId)!)
    }

  }

  function onCardDragLeave(evt: DragEvent, board: BoardModel) {
    console.debug(`DRAG-LEAVE: board<${board.identifier}>, card<${draggingCard?.identifier}>`)

    // FIXME: Can child elements stop having these events? Ie. can board capture event?
    // FIXME: This doesn't actually work...
    if (evt.target === evt.currentTarget) {
      setDraggingCard(null)
    }
  }

  function onCardDrop(evt: DragEvent, board: BoardModel) {
    console.debug(`DROP: board<${board.identifier}>, card<${draggingCard?.identifier}>`)

    if (!draggingCard || draggingCard.board === board.identifier) {
      return
    }

    updateCardLocations([{
      card: draggingCard.identifier,
      board: board.identifier,
    }]).finally(() => setDraggingCard(null))
  }

  // This SEEMS to be reliably called when canceling via escape, but it seems to
  // be called only intermittently on dropping a draggable
  function onCardDragEnd(evt: DragEvent) {
    console.debug(`DRAG-END: card<${draggingCard?.identifier}>`)
    setDraggingCard(null)
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
              // CRUD handlers
              updateBoard={async (params: BoardParams) => updateBoard(board, params)}
              deleteBoard={async () => await deleteBoard(board)}
              createCard={async () => await createCard(board)}
              updateCard={updateCard}
              deleteCard={deleteCard}
              // Drag handlers
              onCardDragStart={onCardDragStart}
              onCardDrag={onCardDrag}
              onCardDragOver={onCardDragOver}
              onCardDragEnter={onCardDragEnter}
              onCardDragLeave={onCardDragLeave}
              onCardDragEnd={onCardDragEnd}
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
