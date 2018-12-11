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

export interface CardModel extends Model {
    board: { identifier: string };
    body: string;
    title: string;
}

export interface WorkspaceModel extends Model {
}

/**
 * State
 */

type BoardMap = { [index:string] : BoardModel };
type CardMap = { [index:string] : CardModel };

enum ActionType {
    ClearStore = 'store-clear',
    CreateWorkspace = 'workspace-create',

    // Boards
    CreateBoard = 'board-create',
    UpdateBoard = 'board-update',
    DeleteBoard = 'board-delete',
    CreateBoards = 'boards-create',

    // Cards
    CreateCard = 'card-create',
    UpdateCard = 'card-update',
    DeleteCard = 'card-delete',
    CreateCards = 'cards-create',
}

interface Action {
    type: ActionType;
    payload?: any;
}

export interface ApplicationState {
    workspace: WorkspaceModel | null;
    boards: BoardMap;
    cards: CardMap;
}

export const initialState = { workspace: null, boards: {}, cards: {} };

/**
 * Reducers
 */

type Reducer = (state: ApplicationState, action: Action) => ApplicationState;

// FUTURE
// These do not really make deep copies of any object, so future states technically
// share memory with past states and can thus 'change history', so to speak
const reducers:{ [index:string] : Reducer } = {

    [ActionType.ClearStore]: (state: ApplicationState, action: Action) => ({ ...initialState }),

    // Creating a new workspace will clear all prior state
    [ActionType.CreateWorkspace]: (state: ApplicationState, { payload }: Action) => ({
        workspace: payload as WorkspaceModel,
        boards: {},
        cards: {},
    }),

    /**
     * Boards
     */

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

    /**
     * Cards
     */

    // Adds a new card
    [ActionType.CreateCard]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        cards: {
            ...state.cards,
            [payload.identifier]: payload as CardModel,
        },
    }),

    // Adds each card to card map
    [ActionType.CreateCards]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        cards: {
            // Keep existing cards..
            ...state.cards,

            // ... and convert new ones from array into map and spread out
            ...payload.reduce((obj: CardMap, ele: CardModel) => {
                obj[ele.identifier] = ele;
                return obj;
            }, {}),
        },
    }),

    // Updates card based on identifier
    [ActionType.UpdateCard]: (state: ApplicationState, { payload }: Action) => ({
        ...state,
        cards: {
            ...state.cards,
            [payload.identifier]: payload as CardModel,
        },
    }),

    // Deletes card based on identifier
    [ActionType.DeleteCard]: (state: ApplicationState, { payload }: Action) => {
        const cards: CardMap = { ...state.cards };
        delete cards[payload.identifier];

        return { ...state, cards };
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

export const createCards = (cards: Array<CardModel>) => STORE.dispatch({
    type: ActionType.CreateCards,
    payload: cards,
});

export const createCard = (card: CardModel) => STORE.dispatch({
    type: ActionType.CreateCard,
    payload: card,
});

export const updateCard = (card: CardModel) => STORE.dispatch({
    type: ActionType.UpdateCard,
    payload: card,
});

export const deleteCard = (card: CardModel) => STORE.dispatch({
    type: ActionType.DeleteCard,
    payload: card,
});
