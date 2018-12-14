class Card < ApplicationRecord
  belongs_to :board
  validates :identifier, presence: true, uniqueness: true
end
