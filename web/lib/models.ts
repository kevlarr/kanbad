/**
 * Models
 *
 * Params objects essentially represent valid 'changesets' for different operations,
 * since some fields are logically updated together at the exclusion of other properties.
 */

export interface Model {
  identifier: string,
}

export interface BoardParams {
  title: string,
}

export interface BoardModel extends Model {
  workspace: string,
  title: string,
  position: string | null,
}

export interface CardParams {
  body: string | null,
  title: string,
}

export interface CardLocationParams {
  board: string,
  card: string,
  position: number,
}

export interface CardModel extends Model {
  board: string,
  body: string | null,
  title: string,
  position: string | null,
}

export interface WorkspaceModel extends Model {}
