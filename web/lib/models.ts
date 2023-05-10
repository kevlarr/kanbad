/**
 * Models
 */

interface Model {
  identifier: string,
}

// The user-updatable properties of a board
export interface BoardParams {
  title: string,
}

export interface BoardModel extends Model, BoardParams {
  workspace: string,
}

// The user-updatable properties of a card
export interface CardParams {
  body: string | null,
  title: string,
}

export interface CardModel extends Model, CardParams {
  board: string,
}

export interface WorkspaceModel extends Model {}

export function compareModelFn(a: Model, b: Model) {
  if (a.identifier == b.identifier) { return 0 }
  if (a.identifier < b.identifier) { return -1 }
  return 1
}
