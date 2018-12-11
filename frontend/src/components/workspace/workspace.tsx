import * as React from 'react';
import { BoardModel, CardModel, WorkspaceModel, createBoard, updateBoard, deleteBoard, createCards } from '../../lib/store';
import twelloApi from '../../lib/api';
import router from '../../lib/router';
import Board from '../board';
import './workspace.scss';

type BoardCardMap = { [index:string] : Array<CardModel> };

interface Props {
    workspace: WorkspaceModel;
    boards: Array<BoardModel>;
    cards: Array<CardModel>;
}

interface State {
}

export class Workspace extends React.Component<Props, State> {
    newBoard() {
        twelloApi
            .post(`boards/new?workspace=${this.props.workspace.identifier}`, { title: 'New Board' })
            .then(board => createBoard(board));
    }

    render() {
        // Group cards based on their board identifier
        const cardsByBoard: BoardCardMap =
            this.props.cards.reduce((byBoard: BoardCardMap, card: CardModel) => {
                const board = card.board.identifier;

                if (!byBoard[board]) {
                    byBoard[board] = [];
                }

                byBoard[board].push(card);
                return byBoard;
            }, {});

        const boards = this.props.boards.map(board => (
            <Board
                key={`board-${board.identifier}`}
                board={board}
                cards={cardsByBoard[board.identifier] || []}
            />
        ));

        return (
            <div className='Workspace'>
                <div className='workspace-meta'>
                    <button className='button add-board' onClick={() => this.newBoard()}>+ Add Board</button>
                    <h2 className='workspace-identifier'>Workspace #{this.props.workspace.identifier}</h2>
                    <p className='workspace-disclaimer'>
                        Make sure to <strong><span className='star'>★</span>bookmark</strong> this page.
                        While we won't lose the workspace, losing the address means you probably will.</p>
                </div>
                <div className='workspace-boards'>
                    {...boards}
                </div>
            </div>
        );
    }
}

export default Workspace;
