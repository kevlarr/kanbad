/**
 * Models
 */

interface Model {
  identifier: string,
}

interface Positionable {
  position: string | null,
}

// The user-updatable properties of a board
export interface BoardParams {
  title: string,
}

export interface BoardModel extends Model {
  workspace: string,
  title: string,
}

// The user-updatable properties of a card
export interface CardParams {
  body: string | null,
  title: string,
}

// Params for updating a card's board & position
export interface CardLocationParams {
  board: string,
  card: string,
}

export interface CardModel extends Model, Positionable {
  board: string,
  body: string | null,
  title: string,
}

export interface WorkspaceModel extends Model {}
