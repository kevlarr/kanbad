import { CardModel } from '@/lib/models'

interface IProps {
  card: CardModel,
}

export default function Card({ card }: IProps) {
  return (
    <div>
      {card.title}
    </div>
  )
}
