import * as React from 'react';
import { CardModel, createCard, updateCard, deleteCard } from '../../lib/store';
//import twelloApi from '../../lib/api';
import './card.scss';

interface Props {
    card: CardModel;
}

interface State {
}

export class Card extends React.Component<Props, State> {
    render() {
        // Rotate randomly between -3 and 3 deg
        const rotation = Math.round(Math.random() * 6) - 3;

        return (
            <div className='Card' style={{transform: `rotate(${rotation}deg)`}}>
                <div className='card-pin'></div>
                {this.props.card.title}
            </div>
        );
    }
}

export default Card;
