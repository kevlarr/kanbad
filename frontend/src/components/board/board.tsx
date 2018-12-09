import * as React from 'react';
import { BoardModel, updateBoard, deleteBoard } from '../../lib/store';
import twelloApi from '../../lib/api';
import './board.scss';

interface Props {
    board: BoardModel;
}

interface State {
    editing: boolean;
}

export class Board extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { editing: false };
    }

    updateBoard(evt: React.FocusEvent) {
        const title = (evt.target as HTMLInputElement).value;
        const board = this.props.board;

        if (title && title !== board.title) {
            twelloApi
                .put(`boards/${board.identifier}`, { ...board, title })
                .then(board => updateBoard(board));
        }

        this.setState({ editing: false });
    }

    removeBoard() {
        twelloApi
            .delete(`boards/${this.props.board.identifier}`)
            .then(() => deleteBoard(this.props.board));
    }

    renderTitle() {
        if (this.state.editing) {
            return (
                <input
                    className='board-title-input'
                    autoFocus={true}
                    defaultValue={this.props.board.title}
                    onBlur={(evt) => this.updateBoard(evt)}
                />
            );
        }
        return (
            <h3
                className='board-title'
                onClick={() => this.setState({ editing: true })}
            >{this.props.board.title}</h3>
        );
    }

    render() {
        return (
            <div className='Board'>
                {this.renderTitle()}
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
