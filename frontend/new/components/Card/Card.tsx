import { useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import CardForm from '@/components/CardForm/CardForm'
import css from './Card.module.css'


interface IProps {
  card: CardModel,
  updateCard(params: CardParams): Promise<any>,
  deleteCard(): any,
}

export default function Card({ card, updateCard, deleteCard }: IProps) {
  const [isEditing, setEditing] = useState(false)

  async function submitForm(params: CardParams) {
    updateCard(params)
      .then(() => setEditing(false))
  }

  const content = isEditing
    ? <CardForm
        card={card}
        submitForm={submitForm}
        cancelSubmit={() => setEditing(false)}
      />
    : <div className={css.content}>
        <h4 className={css.title}>{card.title}</h4>
        <p className={css.body}>{card.body}</p>
        <div className={css.edit}>
          <button
            className='button sm'
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className='button sm'
            onClick={deleteCard}
          >
            Delete
          </button>
        </div>
      </div>

  return (
    <div className={css.card}>
      <div className={css.pin}></div>
      {content}
    </div>
  )
}
