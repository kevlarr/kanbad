/**
 * Models
 */

interface IModel {
  identifier: string,
}

export interface BoardModel extends IModel {
  workspace: string,
  title: string,
}

// Represents all updatable properties of a BoardModel
export interface BoardParams {
  title: string,
}

export interface CardModel extends IModel {
  board: string,
  body: string,
  title: string,
}

export interface WorkspaceModel extends IModel {}

export function compareModelFn(a: IModel, b: IModel) {
  if (a.identifier == b.identifier) { return 0 }
  if (a.identifier < b.identifier) { return -1 }
  return 1
}
