import { useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import { Button, Heading, Text } from '@/components/base'
import { CardForm } from '@/components'
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
    : <div>
        <Heading level={4}>{card.title}</Heading>
        <Text>{card.body}</Text>
        <div>
          <Button
            compact
            size='sm'
            variant='subtle'
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <Button
            compact
            warn
            size='sm'
            variant='subtle'
            onClick={deleteCard}
          >
            Remove
          </Button>
        </div>
      </div>

  return (
    <div className={css.card}>
      {content}
    </div>
  )
}
