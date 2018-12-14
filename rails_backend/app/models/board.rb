class Board < ApplicationRecord
  belongs_to :workspace
  validates :identifier, presence: true, uniqueness: true
end
