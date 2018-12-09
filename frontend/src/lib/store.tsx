import { createStore } from 'redux';

/**
 * Models
 */

interface Model {
    identifier: string;
}

export interface BoardModel extends Model {
    title: string;
}

/**
 * State
 */

type BoardMap = { [index:string] : Model };

interface State {
    workspace: string | null;
    boards: BoardMap;
}

enum ActionType {
    CreateBoard = 'board-create',
    UpdateBoard = 'board-update',
    DeleteBoard = 'board-delete',
}

interface Action {
    type: ActionType;
    model: Model;
}

/**
 * Reducers
 */

type Reducer = (state: State, action: Action) => State;

const reducers:{ [index:string] : Reducer } = {

    [ActionType.CreateBoard]: (state: State, { model }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [model.identifier]: model,
        },
    }),

    [ActionType.UpdateBoard]: (state: State, { model }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [model.identifier]: model,
        },
    }),

    [ActionType.DeleteBoard]: (state: State, { model }: Action) => {
        const boards: BoardMap = { ...state.boards };
        delete boards[model.identifier];

        return { ...state, boards };
    },
};

const twelloApp = (state: State, action: Action): State => {
    if (state === undefined) {
        return {
            workspace: null,
            boards: {},
        };
    }

    const reducer = reducers[action.type];
    
    return reducer ? reducer(state, action) : state;
};

/**
 * Store
 */

const STORE = createStore(twelloApp);

/**
 * Actions
 */

export const createBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.CreateBoard,
    model: board,
});

export const updateBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.UpdateBoard,
    model: board,
});

export const deleteBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.DeleteBoard,
    model: board,
});
