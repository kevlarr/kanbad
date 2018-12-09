import * as React from 'react';
import { BoardModel, WorkspaceModel, createBoard, updateBoard, deleteBoard } from '../../lib/store';
import router from '../../lib/router';
import Board from '../board';
import './workspace.scss';

interface Props {
    workspace: WorkspaceModel;
    boards: Array<BoardModel>;
}

interface State {
}

export class Workspace extends React.Component<Props, State> {
    newBoard() {
        fetch(`/api/v1/boards/new?workspace=${this.props.workspace.identifier}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'New Board' }),
        }).then((resp) => {
            if (resp.status !== 200) {
                throw new Error(`${resp.status} ${resp.statusText}`);
            }

            return resp.json();
        }).then(board => createBoard(board));
    }

    render() {
        const boards = this.props.boards.map(board => (
            <Board key={`board-${board.identifier}`} board={board} />
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
