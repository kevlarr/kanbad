/**
 * Models
 *
 * Params objects essentially represent valid 'changesets' for different operations,
 * since some fields are logically updated together at the exclusion of other properties.
 */

export interface BoardParams {
  title: string,
}

export interface BoardModel {
  identifier: string,
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

export interface CardModel {
  identifier: string,
  board: string,
  body: string | null,
  title: string,
  position: string | null,
}

export interface WorkspaceModel {
  identifier: string,
}
