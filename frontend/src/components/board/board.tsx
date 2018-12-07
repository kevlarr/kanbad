import * as React from 'react';
import './board.scss';

interface Props {
    title: String
}

interface State {
}

export class Board extends React.Component<Props, State> {
    render() {
        return (
            <div className='Board'>
                <h3 className='board-title'>{this.props.title}</h3>
                <div className='board-cards'>cards</div>
                <div className='board-controls'>
                    <button className='button sm'>+ Add Card</button>
                </div>
            </div>
        );
    }
}

export default Board;
