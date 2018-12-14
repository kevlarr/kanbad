import * as React from 'react';
import { BoardModel, CardModel, createCard, updateBoard, deleteBoard } from '../../lib/store';
import twelloApi from '../../lib/api';
import Card from '../card';
import './board.scss';

interface Props {
    board: BoardModel;
    cards: Array<CardModel>;
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

    addCard() {
        twelloApi
            .post(`cards?board=${this.props.board.identifier}`, { title: 'New Card' })
            .then(card => createCard(card));
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

    renderCards() {
        return this.props.cards.map(card => (
            <Card key={`card-${card.identifier}`} card={card} />
        ));
    }

    render() {
        return (
            <div className='Board'>
                {this.renderTitle()}
                <div className='board-cards'>
                    {...this.renderCards()}
                </div>
                <div className='board-controls'>
                    <button
                        className='button sm'
                        onClick={this.addCard.bind(this)}
                    >+ Add Card</button>
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
