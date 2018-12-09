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
}

interface Action {
    type: ActionType;
    model: Model;
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
    [ActionType.CreateWorkspace]: (state: ApplicationState, { model }: Action) => ({
        workspace: model as WorkspaceModel,
        boards: {},
    }),

    [ActionType.CreateBoard]: (state: ApplicationState, { model }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [model.identifier]: model as BoardModel,
        },
    }),

    [ActionType.UpdateBoard]: (state: ApplicationState, { model }: Action) => ({
        ...state,
        boards: {
            ...state.boards,
            [model.identifier]: model as BoardModel,
        },
    }),

    [ActionType.DeleteBoard]: (state: ApplicationState, { model }: Action) => {
        const boards: BoardMap = { ...state.boards };
        delete boards[model.identifier];

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

// TODO kvlr: should ideally avoid the useless "model" here
export const clearStore = () => STORE.dispatch({
    type: ActionType.ClearStore,
    model: { identifier: '' },
});

export const createWorkspace = (workspace: WorkspaceModel) => STORE.dispatch({
    type: ActionType.CreateWorkspace,
    model: workspace,
});

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
