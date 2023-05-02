import { BoardModel, CardModel } from '@/lib/models'
import Card from '@/components/Card/Card'
import css from './Board.module.css'

interface IProps {
    board: BoardModel,
    cards: Array<CardModel> | undefined,
    createCard: () => {},
    removeBoard: () => {},
}

export default function Board({ board, cards, createCard, removeBoard }: IProps) {
    return (
        <div className={css.board}>
            <h3>{board.title}</h3>
            <div className={css.cards}>
                {cards?.map(card =>
                    <Card
                        key={card.identifier}
                        card={card}
                    />
                )}
            </div>
            <div className={css.controls}>
                <button onClick={createCard}>+ Add Card</button>
                <button onClick={removeBoard}>- Remove Board</button>
            </div>
        </div>
    )
}
