import { FocusEvent, useState } from 'react'
import { Card as MantineCard, SimpleGrid } from '@mantine/core'

import { BoardModel, BoardParams, CardModel, CardParams } from '@/lib/models'
import { Button, Heading } from '@/components/base'
import { Card } from '@/components'

interface IProps {
  board: BoardModel,
  cards: Array<CardModel> | undefined,
  updateBoard(params: BoardParams): Promise<any>,
  deleteBoard(): any,
  createCard(): any,
  updateCard(card: CardModel, params: CardParams): Promise<any>,
  deleteCard(card: CardModel): any,
}

export default function Board({
  board,
  cards,
  updateBoard,
  deleteBoard,
  createCard,
  updateCard,
  deleteCard,
}: IProps) {
  const [isEditing, setEditing] = useState(false)

  async function updateTitle(evt: FocusEvent) {
    const title = (evt.target as HTMLInputElement).value

    if (title === board.title) {
      setEditing(false)
      return
    }

    updateBoard({ title })
      .then(() => setEditing(false))
  }

  const boardHeader = isEditing
    ? <input
        autoFocus={true}
        defaultValue={board.title}
        onBlur={updateTitle}
      />
    : <Heading
        level={3}
        onClick={() => setEditing(true)}
      >
        {board.title}
      </Heading>

  return (
    <MantineCard shadow='md' withBorder>
      <MantineCard.Section inheritPadding withBorder>
        {boardHeader}
      </MantineCard.Section>

      <SimpleGrid
        cols={4}
        mt='lg'
        breakpoints={[
          { maxWidth: '82rem', cols: 3 },
          { maxWidth: '62rem', cols: 2 },
          { maxWidth: '42rem', cols: 1 },
        ]}
      >
        {cards?.map(card =>
          <Card
            key={card.identifier}
            card={card}
            updateCard={async (params: CardParams) => await updateCard(card, params)}
            deleteCard={async () => await deleteCard(card)}
          />
        )}
      </SimpleGrid>

      <MantineCard.Section mt='md' inheritPadding>
        <Button
          compact
          size='sm'
          variant='subtle'
          onClick={createCard
        }>
          Add Card
        </Button>

        <Button
          compact
          danger
          size='sm'
          variant='subtle'
          onClick={deleteBoard}
        >
          Remove Board
        </Button>
      </MantineCard.Section>
    </MantineCard>
  )
}
