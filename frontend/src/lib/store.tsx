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

export interface WorkspaceModel extends Model {
}

/**
 * State
 */

type BoardMap = { [index:string] : BoardModel };

enum ActionType {
    ClearStore = 'store-clear',
    CreateWorkspace = 'workspace-create',
    CreateBoard = 'board-create',
    UpdateBoard = 'board-update',
    DeleteBoard = 'board-delete',
    CreateBoards = 'boards-create',
}

interface Action {
    type: ActionType;
    payload?: any;
}

export interface ApplicationState {
    workspace: WorkspaceModel | null;
    boards: BoardMap;
}

export const initialState = { workspace: null, boards: {} };

/**
 * Reducers
 */

type Reducer = (state: ApplicationState, action: Action) => ApplicationState;

const reducers:{ [index:string] : Reducer } = {

    [ActionType.ClearStore]: (state: ApplicationState, action: Action) => ({ ...initialState }),

    // Creating a new workspace will clear all prior state
    [ActionType.CreateWorkspace]: (state: ApplicationState, { payload }: Action) => ({
        workspace: payload as WorkspaceModel,
        boards: {},
    }),

    // Adds a new board to the state
    [ActionType.CreateBoard]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [payload.identifier]: payload as BoardModel,
        },
    }),

    // Creates a new board map from provided array
    [ActionType.CreateBoards]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        boards: payload.reduce((obj: BoardMap, ele: BoardModel) => {
            obj[ele.identifier] = ele;
            return obj;
        }, {}),
    }),

    // Updates board based on identifier
    [ActionType.UpdateBoard]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [payload.identifier]: payload as BoardModel,
        },
    }),

    // Deletes board based on identifier
    [ActionType.DeleteBoard]: (state: ApplicationState, { payload }: Action) => {
        const boards: BoardMap = { ...state.boards };
        delete boards[payload.identifier];

        return { ...state, boards };
    },
};

const twelloApp = (state: ApplicationState, action: Action): ApplicationState => {
    console.log(`Action: ${JSON.stringify(action)}`);

    let newState;

    if (state === undefined) {
        newState = initialState;
    } else {
        const reducer = reducers[action.type];
        
        newState = reducer ? reducer(state, action) : state;
    }

    console.log(`New State: ${JSON.stringify(newState)}`);

    return newState;
};

/**
 * Store
 */

export const STORE = createStore(twelloApp);

/**
 * Actions
 */

export const clearStore = () => STORE.dispatch({
    type: ActionType.ClearStore,
});

export const createWorkspace = (workspace: WorkspaceModel) => STORE.dispatch({
    type: ActionType.CreateWorkspace,
    payload: workspace,
});

export const createBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.CreateBoard,
    payload: board,
});

export const createBoards = (boards: Array<BoardModel>) => STORE.dispatch({
    type: ActionType.CreateBoards,
    payload: boards,
});

export const updateBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.UpdateBoard,
    payload: board,
});

export const deleteBoard = (board: BoardModel) => STORE.dispatch({
    type: ActionType.DeleteBoard,
    payload: board,
});
