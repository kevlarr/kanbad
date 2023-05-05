import { useState } from 'react'
import { Button, Card as MantineCard } from '@mantine/core'

import { CardModel, CardParams } from '@/lib/models'
import CardForm from '@/components/CardForm/CardForm'


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
        <h4>{card.title}</h4>
        <p>{card.body}</p>
        <div>
          <Button
            compact
            color='gray'
            size='xs'
            variant='subtle'
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <Button
            compact
            color='gray'
            size='xs'
            variant='subtle'
            onClick={deleteCard}
          >
            Delete
          </Button>
        </div>
      </div>

  return (
    <MantineCard shadow='md' padding='md' withBorder>
      {content}
    </MantineCard>
  )
}
