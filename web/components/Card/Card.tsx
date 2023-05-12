import { DragEvent, useState } from 'react'

import { CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, Text } from '@/components/base'
import { CardForm } from '@/components'
import css from './Card.module.css'


interface CardProps {
  card: CardModel,
  // TODO: Better typing
  updateCard(params: CardParams): Promise<any>,
  deleteCard(): any,
  // TODO: Type these
  onDrag(evt: DragEvent, card: CardModel): any,
  onDragStart(evt: DragEvent, card: CardModel): any,
  onDragEnd(evt: DragEvent, card: CardModel): any,
}

export default function Card({
  card,
  updateCard,
  deleteCard,
  onDrag,
  onDragStart,
  onDragEnd,
}: CardProps) {
  const [isEditing, setEditing] = useState(false)

  // While there are several ways to make child elements selectable within
  // a draggable parent, they typically don't work in Firefox, but simply
  // setting the draggable attribute to false while inside the content does.
  const [isDraggable, setDraggable] = useState(true)

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

  const classes = [
    css.card,
    isDraggable ? css.draggable : null,
  ]

  return (
    <FlexContainer
      className={classes.join(' ')}
      direction='column'
      pad='md'
      draggable={isDraggable}
      {...(isDraggable && {
        onDrag: (e) => onDrag(e, card),
        onDragStart: (e) => onDragStart(e, card),
        onDragEnd: (e) => onDragEnd(e, card),
      })}
    >
      <FlexContainer
        className={css.content}
        direction='column'
        onMouseEnter={() => setDraggable(false)}
        onMouseLeave={() => setDraggable(true)}
      >
        {content}
      </FlexContainer>
    </FlexContainer>
  )
}
