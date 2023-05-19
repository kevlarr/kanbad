import { DragEvent, useState } from 'react'

import { setEventDataCard } from '@/lib/dnd'
import { CardModel, CardParams } from '@/lib/models'
import { Button, FlexContainer, Heading, Text } from '@/components/base'
import { CardForm } from '@/components'
import css from './Card.module.css'


interface CardProps {
  card: CardModel,
  // TODO: Better typing
  updateCard(params: CardParams): Promise<any>,
  deleteCard(): any,
}

export default function Card({
  card,
  updateCard,
  deleteCard,
}: CardProps) {
  const [isEditing, setEditing] = useState(false)

  // Same with `Board` - control whether or not its draggable so that its
  // children can be selected
  const [isDraggable, setDraggable] = useState(true)

  async function submitForm(params: CardParams) {
    updateCard(params).then(() => setEditing(false))
  }

  function onDragStart(evt: DragEvent) {
    console.debug(`DRAG-START: card<${card.identifier}>`)
    evt.stopPropagation()
    setEventDataCard(evt, card)
  }

  function onDrag(evt: DragEvent) {
    console.debug(`DRAG: card<${card.identifier}>`)
    evt.stopPropagation()
  }

  function onDragEnd(evt: DragEvent) {
    console.debug(`DRAG-END: card<${card.identifier}>`)
    evt.stopPropagation()
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
      pad='sm'
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
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
