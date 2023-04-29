/**
 * Models
 */

interface Model {
    identifier: string;
}

export interface BoardModel extends Model {
    title: string;
}

export interface CardModel extends Model {
    board: { identifier: string };
    body: string;
    title: string;
}

export interface WorkspaceModel extends Model {
}