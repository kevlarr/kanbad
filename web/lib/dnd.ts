import { DragEvent } from 'react'

import { BoardModel, CardModel } from '@/lib/models'

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
export const CARD_DRAG_TYPE = 'kanbad/cardId'
export const BOARD_DRAG_TYPE = 'kanbad/boardId'

export function getEventDataBoard(evt: DragEvent): BoardModel | null {
  const boardJson = evt.dataTransfer.getData(BOARD_DRAG_TYPE)

  return boardJson ? JSON.parse(boardJson) : null
}

export function setEventDataBoard(evt: DragEvent, board: BoardModel) {
  evt.dataTransfer.setData(BOARD_DRAG_TYPE, JSON.stringify(board))
}

export function getEventDataCard(evt: DragEvent): CardModel | null {
  const cardJson = evt.dataTransfer.getData(CARD_DRAG_TYPE)

  return cardJson ? JSON.parse(cardJson) : null
}

export function setEventDataCard(evt: DragEvent, card: CardModel) {
  evt.dataTransfer.setData(CARD_DRAG_TYPE, JSON.stringify(card))
}
