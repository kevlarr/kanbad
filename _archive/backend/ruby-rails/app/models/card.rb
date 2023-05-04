class Card < ApplicationRecord
  belongs_to :board
  validates :identifier, presence: true, uniqueness: true

  scope :for_board, -> ident { joins(:board).where(boards: {identifier: ident}) }

  def as_json(opts = {})
    super(opts).merge(board: board.as_json(only: :identifier))
  end
end
