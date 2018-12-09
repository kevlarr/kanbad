import { createStore } from 'redux';

interface State {
    workspace: string | null;
    boards: { [index:string] : {}};
    cards: { [index:string] : {}};
}

interface Action {
    type: ActionType;
    identifier: string;
    data?: {};
}

enum ActionType {
    CreateBoard = 'board-create',
    UpdateBoard = 'board-update',
    DeleteBoard = 'board-delete',
}

/**
 * Reducers
 */

type Reducer = (state: State, action: Action) => State;

const reducers:{ [index:string] : Reducer } = {

    [ActionType.CreateBoard]: (state: State, { identifier, data }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [identifier]: { identifier, ...data },
        },
    }),

    [ActionType.UpdateBoard]: (state: State, { identifier, data }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [identifier]: { identifier, ...data },
        },
    }),

    [ActionType.DeleteBoard]: (state: State, { identifier }: Action) => {
        const boards: { [index:string] : {} } = { ...state.boards };
        delete boards[identifier];

        return { ...state, boards };
    },
};

const twelloApp = (state: State, action: Action): State => {
    if (state === undefined) {
        return {
            workspace: null,
            boards: {},
            cards: {},
        };
    }

    const reducer = reducers[action.type];
    
    return reducer ? reducer(state, action) : state;
};

export const STORE = createStore(twelloApp);

/**
 * Models
 */

interface Board {
    identifier: string;
    title: string;
}

/**
 * Actions
 */

export const createBoard = (board: Board) => STORE.dispatch({
    type: ActionType.CreateBoard,
    identifier: board.identifier,
    data: board,
});

export const updateBoard = (board: Board) => STORE.dispatch({
    type: ActionType.UpdateBoard,
    identifier: board.identifier,
    data: board,
});

export const deleteBoard = (board: Board) => STORE.dispatch({
    type: ActionType.DeleteBoard,
    identifier: board.identifier,
});
