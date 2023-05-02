/**
 * Models
 */

interface Model {
    identifier: string,
}

export interface BoardModel extends Model {
    workspace: string,
    title: string,
}

export interface CardModel extends Model {
    board: string,
    body: string,
    title: string,
}

export interface WorkspaceModel extends Model {}
