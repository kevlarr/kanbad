import * as React from 'react';
import { BoardModel, deleteBoard } from '../../lib/store';
import twelloApi from '../../lib/api';
import './board.scss';

interface Props {
    board: BoardModel;
}

interface State {
}

export class Board extends React.Component<Props, State> {
    removeBoard() {
        twelloApi
            .delete(`boards/${this.props.board.identifier}`)
            .then(() => deleteBoard(this.props.board));
    }

    render() {
        return (
            <div className='Board'>
                <h3 className='board-title'>{this.props.board.title}</h3>
                <div className='board-cards'>cards</div>
                <div className='board-controls'>
                    <button className='button sm'>+ Add Card</button>
                    <button
                        className='button sm'
                        onClick={this.removeBoard.bind(this)}
                    >Delete Board</button>
                </div>
            </div>
        );
    }
}

export default Board;
