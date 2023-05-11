import { useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, Text } from '@/components/base'
import { CardForm } from '@/components'
import css from './Card.module.css'


interface CardProps {
  card: CardModel,
  updateCard(params: CardParams): Promise<any>,
  deleteCard(): any,
}

export default function Card({ card, updateCard, deleteCard }: CardProps) {
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
    : <FlexContainer direction='column' gap='sm'>
        <Heading level={4}>{card.title}</Heading>
        <Text>{card.body}</Text>
        <FlexContainer>
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
        </FlexContainer>
      </FlexContainer>

  return (
    <div className={css.card}>
      {content}
    </div>
  )
}
