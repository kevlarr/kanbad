/**
 * Models
 */

interface IModel {
  identifier: string,
}

// The user-updatable properties of a board
export interface BoardParams {
  title: string,
}

export interface BoardModel extends IModel, BoardParams {
  workspace: string,
}

// The user-updatable properties of a card
export interface CardParams {
  body: string,
  title: string,
}

export interface CardModel extends IModel, CardParams {
  board: string,
}

export interface WorkspaceModel extends IModel {}

export function compareModelFn(a: IModel, b: IModel) {
  if (a.identifier == b.identifier) { return 0 }
  if (a.identifier < b.identifier) { return -1 }
  return 1
}
